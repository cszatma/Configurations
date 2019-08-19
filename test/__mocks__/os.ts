const os: any = jest.genMockFromModule('os');

os.homedir = () => 'home';

export default os;
