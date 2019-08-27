import { AfterContentInit, ViewEncapsulation,ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, Input, OnChanges, OnDestroy, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { reverseChildNodes } from 'ng-zorro-antd/core';
import { TimelineItemComponent } from './timeline-item.component';


export type TimelineMode = 'left' | 'alternate' | 'right';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  selector: 'timeline',
  // exportAs: 'Timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./style.scss']
})
export class TimelineComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ViewChild('timeline', { static: false }) timeline: ElementRef<HTMLElement>;
  @ContentChildren(TimelineItemComponent) listOfTimeLine: QueryList<TimelineItemComponent>;
  @ContentChild('pending', { static: false }) _pendingContent: TemplateRef<void>;

  @Input() Mode: TimelineMode;
  @Input() Pending: string | boolean | TemplateRef<void>;
  @Input() PendingDot: string | TemplateRef<void>;
  @Input() Reverse: boolean = false;

  isPendingBoolean: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const modeChanges = changes.Mode;
    const reverseChanges = changes.Reverse;
    const pendingChanges = changes.Pending;

    if (modeChanges && (modeChanges.previousValue !== modeChanges.currentValue || modeChanges.isFirstChange())) {
      this.updateChildren();
    }
    if (
      reverseChanges &&
      reverseChanges.previousValue !== reverseChanges.currentValue &&
      !reverseChanges.isFirstChange()
    ) {
      this.reverseChildTimelineDots();
    }
    if (pendingChanges) {
      this.isPendingBoolean = pendingChanges.currentValue === true;
    }
  }

  ngAfterContentInit(): void {
    this.updateChildren();
    if (this.listOfTimeLine) {
      this.listOfTimeLine.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.updateChildren();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChildren(): void {
    if (this.listOfTimeLine && this.listOfTimeLine.length) {
      const length = this.listOfTimeLine.length;
      this.listOfTimeLine.toArray().forEach((item, index) => {
        item.isLast = !this.Reverse ? index === length - 1 : index === 0;
        item.position =
          this.Mode === 'left' || !this.Mode
            ? undefined
            : this.Mode === 'right'
            ? 'right'
            : this.Mode === 'alternate' && index % 2 === 0
            ? 'left'
            : 'right';
        item.detectChanges();
      });
      this.cdr.markForCheck();
    }
  }

  private reverseChildTimelineDots(): void {
    // if (this.platform.isBrowser) {
    //   reverseChildNodes(this.timeline.nativeElement as HTMLElement);
    //   this.updateChildren();
    // }
  }
}
