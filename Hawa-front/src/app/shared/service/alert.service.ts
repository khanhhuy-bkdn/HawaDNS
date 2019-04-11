import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { ToastyService, ToastOptions, ToastData, ToastyConfig } from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  subject = new Subject<any>();
  keepAfterNavigationChange = false;


  interval = 100000;
  subscription: Subscription;
  toastOptions: ToastOptions
  
  constructor(private router: Router , private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });

    this.toastyConfig.theme = 'bootstrap';

    this.toastOptions =  {
      title: "",
      msg: "",
      showClose: true,
      timeout: 4000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
          // // Run the timer with 1 second iterval
          // let observable = Observable.interval(this.interval);
          // // Start listen seconds beat
          // this.subscription = observable.subscribe((count: number) => {
          //     // Update title of toast
          //     toast.title = "";
          //     // Update message of toast
          //     toast.msg = "";
          //     // Extra condition to hide Toast after 10 sec
          //     if (count > 10) {
          //         // We use toast id to identify and hide it
          //         this.toastyService.clear(toast.id);
          //     }
          // });

      },
      onRemove: function(toast: ToastData) {
          // Stop listenning
          // this.subscription.unsubscribe();
      }
  };

  }

  success(message: string, keepAfterNavigationChange = false) {
    this.toastOptions.title = "Thành công";
    this.toastOptions.msg = message;
    this.toastyService.success(this.toastOptions);
    // this.keepAfterNavigationChange = keepAfterNavigationChange;
    // this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    // this.keepAfterNavigationChange = keepAfterNavigationChange;
    // this.subject.next({ type: 'error', text: message });
    this.toastOptions.title = "Thất bại";
    this.toastOptions.msg = message;
    this.toastyService.error(this.toastOptions);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
