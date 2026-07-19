import { CdsWidgetLogsComponent } from './cds-widget-logs.component';

describe('CdsWidgetLogsComponent', () => {
  let component: CdsWidgetLogsComponent;
  let closeLog: jasmine.Spy;

  beforeEach(() => {
    closeLog = jasmine.createSpy('closeLog');
    component = new CdsWidgetLogsComponent(
      {} as any,
      {} as any,
      { closeLog } as any,
      {} as any,
      {} as any,
      {} as any,
      { resetLiveActiveIntent: jasmine.createSpy('resetLiveActiveIntent') } as any
    );
  });

  it('keeps MQTT connected while hidden and closes it on destroy', () => {
    component.IS_OPEN_PANEL_WIDGET = false;
    expect(closeLog).not.toHaveBeenCalled();

    component.ngOnDestroy();
    expect(closeLog).toHaveBeenCalledOnceWith();
  });
});
