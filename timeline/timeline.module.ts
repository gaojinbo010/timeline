import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimelineItemComponent } from './timeline-item.component';
import { TimelineComponent } from './timeline.component';
import { StringTemplateOutletDirective } from './string_template_outlet';

@NgModule({
  declarations: [TimelineItemComponent, TimelineComponent,StringTemplateOutletDirective],
  exports: [TimelineItemComponent, TimelineComponent],
  imports: [CommonModule]
})
export class TimelineModule {}
