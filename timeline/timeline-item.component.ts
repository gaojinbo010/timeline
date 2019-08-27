import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { TimelineMode } from './timeline.component';


export type TimelineItemColor = 'red' | 'blue' | 'green' | 'gray' | string;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'timeline-item, [timeline-item]',
  // exportAs: 'TimelineItem',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./style.scss']
})
export class TimelineItemComponent implements OnInit, OnChanges {
  @ViewChild('liTemplate', { static: true }) liTemplate: ElementRef;
  @Input() Color: TimelineItemColor = 'blue';
  @Input() Dot: string | TemplateRef<void>;

  isLast = false;
  position: TimelineMode | undefined;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.tryUpdateCustomColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Color) {
      this.tryUpdateCustomColor();
    }
  }

  detectChanges(): void {
    this.cdr.detectChanges();
  }

  private tryUpdateCustomColor(): void {
    const defaultColors = ['blue', 'red', 'green', 'gray'];
    const circle = this.liTemplate.nativeElement.querySelector('.timeline-item-head');
    if (defaultColors.indexOf(this.Color) === -1) {
      this.renderer.setStyle(circle, 'border-color', this.Color);
    } else {
      this.renderer.removeStyle(circle, 'border-color');
    }
  }
}
