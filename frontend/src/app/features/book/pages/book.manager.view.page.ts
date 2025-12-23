import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Book} from '@features/book/models/book.model';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';

@Component({
  selector: 'book-manager-view-page',
  imports: [
    LayoutComponent,
    BoxComponent
  ],
  template: `
    <layout-component>
      <box-component>
<!--        <h2>Berichtsheft von {{ book().trainee.forename }} {{ book().trainee.surname }}</h2>-->
      </box-component>
    </layout-component>
  `
})
export class BookManagerViewPage {

  // private readonly route = inject(ActivatedRoute);
  // private data = toSignal(this.route.data);
  // book = computed(() => this.data()!!["book"] as Book);

}
