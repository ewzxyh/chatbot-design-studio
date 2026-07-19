import { CdsPanelWidgetComponent } from './cds-panel-widget.component';

describe('CdsPanelWidgetComponent', () => {
  let component: CdsPanelWidgetComponent;
  let initStaticServices: jasmine.Spy;

  beforeEach(() => {
    initStaticServices = jasmine.createSpy('initStaticServices');
    component = new CdsPanelWidgetComponent(
      { getConfig: () => ({ apiUrl: '/api/' }) } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { initStaticServices } as any
    );
    spyOn(component.newConversation, 'emit');
    component.onLoaded(null);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('ignores invalid conversation ids', () => {
    window.dispatchEvent(new MessageEvent('message', {
      data: { source: 'widget', event: 'onNewConversation', data: { conversation_id: 'null' } }
    }));

    expect(component.newConversation.emit).not.toHaveBeenCalled();
  });

  it('rebinds logs to the new conversation and confirms it from the first message', () => {
    component.support_group_id = 'support-group-old';
    window.dispatchEvent(new MessageEvent('message', {
      data: { source: 'widget', event: 'onNewConversation', data: { conversation_id: ' support-group-new ' } }
    }));

    expect(component.support_group_id).toBeNull();
    expect(component.newConversation.emit).toHaveBeenCalledWith('support-group-new');

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        source: 'widget',
        event: 'onMessageCreated',
        data: {
          message: {
            status: 1,
            recipient: 'support-group-new',
            attributes: { projectId: 'project-1' }
          }
        }
      }
    }));

    expect(component.newConversation.emit).toHaveBeenCalledWith('support-group-new');
    expect(initStaticServices).toHaveBeenCalledWith('/api/', 'project-1', 'support-group-new');
  });
});
