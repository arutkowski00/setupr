import * as fs from 'fs';
import * as yaml from 'js-yaml';
import 'reflect-metadata';
import { GlobalMock, IGlobalMock, IMock, It, Mock } from 'typemoq';
import { AppContainer } from '../../src/ioc/container';
import { TYPE } from '../../src/ioc/type';
import { ProjectLoader, ProjectValidator, Project } from '../../src/project';
import { FileSystemUtils } from '../../src/utils/file';

describe('Project Loader', () => {
  let fsUtilsMock: IMock<FileSystemUtils>;
  let validatorMock: IMock<ProjectValidator>;
  let loader: ProjectLoader;

  const testProject: Project = {
    dependencies: [
      '1', '2', '3',
    ],
  };

  const testFiles = [
    { name: 'setupr.json', content: JSON.stringify(testProject, null, 2) },
    { name: 'setupr.yml', content: yaml.safeDump(testProject) }
  ];

  beforeEach(() => {
    fsUtilsMock = Mock.ofType<FileSystemUtils>();
    validatorMock = Mock.ofType<ProjectValidator>();
    loader = new ProjectLoader(validatorMock.object, fsUtilsMock.object);

    expect.hasAssertions();
  });

  afterEach(() => {
    fsUtilsMock.verifyAll();
    validatorMock.verifyAll();
  });

  describe('getProjectConfiguration()', () => {
    for (const testFile of testFiles) {
      test(`loads project from ${testFile.name}`, () => {
        fsUtilsMock
          .setup(x => x.readDirectoryContents(It.isAny()))
          .returns(() => Promise.resolve([testFile.name]))
          .verifiable();

        fsUtilsMock
          .setup(x => x.readFile(testFile.name))
          .returns(() => Promise.resolve(testFile.content))
          .verifiable();

        validatorMock
          .setup(x => x.validate(testProject))
          .returns(() => Promise.resolve(testProject))
          .verifiable();

        expect(loader.getProjectConfiguration()).resolves.toBe(testProject);
      });

      test(`rejects unparseable ${testFile.name}`, async () => {
        fsUtilsMock
          .setup(x => x.readDirectoryContents(It.isAny()))
          .returns(() => Promise.resolve([testFile.name]))
          .verifiable();

        fsUtilsMock
          .setup(x => x.readFile(It.isAny()))
          .returns(() => Promise.resolve("{%some{}}{rubbish{"))
          .verifiable();

        try {
          await loader.getProjectConfiguration();
        } catch (e) {
          expect(e).toBeTruthy();
        }
      });
    }

    test(`rejects when found more than one configuration file`, async () => {
      fsUtilsMock
        .setup(x => x.readDirectoryContents(It.isAny()))
        .returns(() => Promise.resolve(testFiles.map(x => x.name)))
        .verifiable();

      try {
        await loader.getProjectConfiguration();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    test(`rejects when found no configuration files`, async () => {
      fsUtilsMock
        .setup(x => x.readDirectoryContents(It.isAny()))
        .returns(() => Promise.resolve(['somefile.txt', 'anotherfile.png']))
        .verifiable();

      try {
        await loader.getProjectConfiguration();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    test(`rejects when validation fails`, async () => {
      const testFile = testFiles[0];

      const reason = { error: 123 };

      fsUtilsMock
        .setup(x => x.readDirectoryContents(It.isAny()))
        .returns(() => Promise.resolve([testFile.name]))
        .verifiable();

      fsUtilsMock
        .setup(x => x.readFile(testFile.name))
        .returns(() => Promise.resolve(testFile.content))
        .verifiable();

      validatorMock
        .setup(x => x.validate(testProject))
        .returns(() => Promise.reject(reason))
        .verifiable();

      try {
        await loader.getProjectConfiguration();
      } catch (e) {
        expect(e).toBe(reason);
      }
    });
  });
});
