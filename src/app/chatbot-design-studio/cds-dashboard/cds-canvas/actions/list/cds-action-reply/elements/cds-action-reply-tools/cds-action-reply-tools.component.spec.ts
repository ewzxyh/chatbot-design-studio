import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TYPE_COMMAND, TYPE_MESSAGE } from '../../../../../../../utils';

import { CdsActionReplyToolsComponent } from './cds-action-reply-tools.component';

describe('CdsActionReplyToolsComponent', () => {
  let component: CdsActionReplyToolsComponent;
  let fixture: ComponentFixture<CdsActionReplyToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdsActionReplyToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdsActionReplyToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a sticker with the image metadata shape', () => {
    let newElement: any;
    component.addNewActionReply.subscribe(element => newElement = element);

    component.addElement(TYPE_MESSAGE.STICKER);

    expect(newElement).toEqual({
      type: TYPE_COMMAND.MESSAGE,
      message: {
        text: '',
        type: TYPE_MESSAGE.STICKER,
        metadata: {
          src: '',
          downloadURL: ''
        }
      }
    });
  });
});
