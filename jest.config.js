export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    // Si no tienes 'jest.setup.js', puedes comentar o eliminar esta línea
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  };
  