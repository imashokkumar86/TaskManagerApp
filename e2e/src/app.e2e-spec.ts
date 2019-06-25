import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Welcome to ProjectManagementUI', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to ProjectManagementUI!');
  });
});
