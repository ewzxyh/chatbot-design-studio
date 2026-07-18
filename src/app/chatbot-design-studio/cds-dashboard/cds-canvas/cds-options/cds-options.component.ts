import { Component, EventEmitter, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { StageService } from 'src/app/chatbot-design-studio/services/stage.service';
import { OPTIONS } from 'src/app/chatbot-design-studio/utils';

@Component({
  selector: 'cds-options',
  templateUrl: './cds-options.component.html',
  styleUrls: ['./cds-options.component.scss']
})
export class CdsOptionsComponent implements OnInit {
  @ViewChild('alphaInput') alphaInput!: ElementRef;
  @Input() id_faq_kb: any;
  @Input() stateUndoRedo: any;
  @Input() disconnectedBlockCount = 0;
  @Input() unlinkedBlockCount = 0;
  @Output() onOptionClicked = new EventEmitter<{ option: OPTIONS; alpha?: any }>();

  OPTIONS = OPTIONS;
  alpha: number;
  isMoreMenu: boolean = false;
  stageSettings: any;
  
  

  constructor(
    private readonly stageService: StageService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }


  private initialize(){
    this.alpha = this.stageService.getAlpha();
  }

  // updateAlphaConnectors() {
  //   this.onOptionClicked.emit({ option: OPTIONS.ALPHA, alpha: this.alpha });
  // }

  forceAlphaConnectorsFocus(): void {
    this.alphaInput.nativeElement.focus();
  }

  closeAlphaConnectorsMenu(){
    this.isMoreMenu = false;
  }


  onOptionClick(option){
    this.onOptionClicked.emit({option: option});
  }

  get organizeFlowTooltip(): string {
    const details = [];
    if (this.disconnectedBlockCount > 0) {
      details.push(`${this.disconnectedBlockCount} fora do fluxo principal`);
    }
    if (this.unlinkedBlockCount > 0) {
      details.push(`${this.unlinkedBlockCount} sem ligação`);
    }
    return details.length > 0
      ? `Organizar fluxo · ${details.join(' · ')}`
      : 'Organizar fluxo';
  }

  onTogleAlphaConnectorsMenu(){
    this.isMoreMenu = !this.isMoreMenu;
    if(this.isMoreMenu){
      setTimeout(() => {
        if (this.alphaInput) {
          this.forceAlphaConnectorsFocus();
        }
      }, 0);
    } 
  }

  onChangeAlphaConnectors(alpha){
    this.onOptionClicked.emit({ option: OPTIONS.ALPHA, alpha: alpha });
  }
}
