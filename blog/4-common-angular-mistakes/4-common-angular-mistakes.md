---
title: 4 Common Angular Mistakes
published: true
description: Prevent these mistakes and improve your Angular code
cover_image: angular.jpg
date: 2021-03-22
---

**Are you making these four Angular mistakes?** OK, now that I got your attention we can add back some nuance to the clickbait. I thought it would be fun to make a list of frequent Angular 'mistakes'. However, none of these four items are _always_ a mistake. I've found that they are often a code-smell or an indication that there might be a flaw in the code. I've made these mistakes myself a lot and I saw them happen a lot, too. I think it's a good thing to be aware of the potential issues and the possible solutions to them. So let's get to it.

## 1. Not unsubscribing

With Angular, you will almost certainly deal with observables sooner or later. In order to use them, we either need to subscribe explicitly in the `.ts` file, or use them directly with the async pipe in the `.html` template. I suggest using the async pipe as much as possible since it will automatically unsubscribe for you, but sometimes you just need the data in your TypeScript file. In that case, it's very easy to forget to unsubscribe.

Why is this a problem? Well, the subscription keeps tabs on the observable, even after the component is gone. That means we are still waiting on data, even when we no longer need it. So in fact, by not unsubscribing, you are creating a memory leak.

Luckily, it's easily fixed. There are multiple ways to do it:

1. Use the async pipe where possible. You can use the data in your template like this: `<p>{% raw %}{{ observable | async }}{% endraw %}</p>`. If you need to transform the data in any way, you can do it with RxJS without needing to subscribe.
2. If you only need the first emission from an observable, consider using first() (or take(1)) in the subscription: `this.observable.pipe(first()).subscribe(...)`. This will automatically unsubscribe _after getting the first emission_. If it is possible that it won't emit something, this is not the right option. Also, if you expect the data to possibly change while viewing/interacting with the component, it's also not the right option. When in doubt, go for option 3:
3. Initialize a property with a subscription, and add any new subscriptions to that. In the ngOnDestroy method, you can then unsubscribe to just the one subscription (which will contain the others):

```javascript
subscription = new Subscription();

ngOnInit(): void {
  // Here we want to subscribe to this.observable:
  this.subscription.add(this.observable.subscribe(...));
}

ngOnDestroy(): void {
  // Unsubscribe to all observables we've added to this.subscription
  this.subscription.unsubscribe();
}
```

## 2. Not using trackBy

Even though it's in the Angular docs, it can be easily forgotten. In Angular loops, you have to provide a function that keeps track of the items, to see whether or not they have changed. If you don't do this, Angular doesn't know which items are different. So when there's a change, it will re-render the entire thing instead of only the changed item(s).

This is the one I still forget sometimes. The reason why this happens so often, is that it's not always immediately obvious from the app that there's something wrong. However, start adding data or interactivity, and you will start to notice.

One real-world example of this is when you have a list, which you can filter down by typing in an input box. Especially if you have more things going on in your for-loop (a nested loop for instance), it will quickly slow down if you need to filter the list live while typing. You might see the items flash briefly, even if they haven't changed. Of course you can debounce the input (to not trigger the change detection immediately), but it's best to fix it at the root and combine the two tactics.

Now, if you have a simple, flat, unordered list with static data, it doesn't matter that much. Especially if the list always remains the same during the time the component is shown. However, sometimes you just can't be sure whether it's static. In doubt, I'd say add the trackBy function.

It's a matter of creating a function that receives two arguments; the index of the item and the value of the item. You return a value by which the item is uniquely identifiable.

Syntax:

```html
<ul>
  <li *ngFor="let item of data; trackBy: myTrackingFn">
    {% raw %}{{ item.name }}{% endraw %}
  </li>
</ul>
```

```javascript
myTrackingFn(index, value): number {
  return value.id;
}
```

## 3. Using the default change detection

One of the benefits of a framework like Angular, is that it can do a lot for you. An important aspect of this is keeping track of changes. However, by default, Angular has very aggressive change detection, meaning it will check for changes and potentially re-render on every small change (even a scroll event). This is nice when prototyping, but in production this may lead to issues.

Personally, I believe that the default change detection should be OnPush. It will only re-render when inputs change, events fire or when manually triggered. Often, OnPush just works. On some occassions, for instance if you have a few computed properties that need to be displayed (say, you have a calculation that you are doing in your .ts file and need to show it in the template), you will have to manually trigger a change detection cycle.

How to enable OnPush? In the component decorator, add the following line (and import ChangeDetectionStrategy from @angular/core):

```html
changeDetection: ChangeDetectionStrategy.OnPush
```

## 4. Not making (proper) use of RxJS

OK, this turned out to be a pretty long one. Long story short: only subscribing to observables in your component's TS is a difficult pattern that can lead to bugs and having to handle subscriptions. Instead, you can almost always do the things you want to do with RxJS, and by doing that keeping the data an observable. Here's the long version:

Angular comes with RxJS bundled. This library helps us deal with asynchronicity in our data in a reactive way. For instance, if you make a HTTP request, you'll get an observable back. You can then add code to respond to the data you'll receive back later. However, like asynchronous data, RxJS can be pretty hard to fully grasp. I highly recommend to create a sandbox (Codesandbox, Stackblitz) and test some use cases with test data.

When you need to do something to the data that you're getting before showing it, that's when to look closer at RxJS's operators. Transforming, combining, filtering, you name it. In the example, we're getting data from two different APIs, need to combine it and then use it in our application.

When I wasn't aware of everything you could do with RxJS (or rather, was actively avoiding having to use it when I just started), I might haven written code like this: _(for the record, this is a bad example, do not copy)_

```javascript
  name$ = of('Marco').pipe(delay(1000)); // This will be the response for the API.
  // With 'of' and the delay we're mimicking an API response
  job$ = of('developer').pipe(delay(2000)); // Same thing here
  name: string;
  job: string;
  message: string;

  ngOnInit(): void {
    this.data1$.subscribe(val => {
      this.name = val;
    });
    this.data2$.subscribe(val => {
      this.job = val;
      if (this.name && this.job) {
        this.message = `${this.name} is a ${this.job}`;
      }
    });
  }

```

What's happing here and why is it 'wrong'? First, I get two observables (name$ and job$). After that, I declare two properties which will hold the data once we get it back from the observable.

In the OnInit method, I subscribe to both the observables seperately. In the subscribe, I assign to my property to hold the data. So far, it's the same for both. However, I want to show a message in the template, saying 'Marco is a developer'. I need both pieces of data. I added in a check in the second observable, to see if both data sources are already there, and then I build the string.

### Why is this problematic?

This is what's happening, but what's wrong? First of all, with API requests we never know for sure what the response time is going to be. We cannot know for sure whether the first or the second observable will receive the data first. The code will only work if the second observable gets the data later, otherwise nothing will happen. You might opt to copy that code and add it to the first subscription as well. That will work, but you might already have a feeling that it's not supposed to be used that way and does not scale or maintain well.

We also got an issue with change detection. If we set the change detection to OnPush, like we looked at in the previous step, it's not going to pick up any changes. In fact, it will not even pick up the first value. When Angular gets to the OnInit lifecycle method, chances are there hasn't been an emission from the observable (yet). We will never see anything in our template, unless we mock the data without any delay.

On top of that, we also did not manage the subscription. We've got a memory leak here (see tip 1!).

Summarizing, we got five properties to construct a simple string based on two observables. We also have issues with synchronicity, change detection and unhandled subscriptions. Most of these issues can be fixed using the same style of coding, but by now it's becoming clear that surely, there's a better way?

### How to improve this?

Well, we need to make better use of RxJS! We want to take that data, as it comes in, in whatever order, and combine it. We show it on the page only when we have both pieces. A good place to start is on [learnrxjs.io](https://www.learnrxjs.io). Looking at the navbar, I think I want to search in the 'Operators' category. There's some subcategories there, but the first is 'Combination', which is what I want. CombineLatest sounds like something that might fit. Reading the description, it surely looks that way. It says:

| When any observable emits a value, emit the last emitted value from each

That's basically what we want, so let's proceed. For the record, there are other operators to consider for this use case (e.g. forkJoin, withLatestFrom or zip) but combineLatest is the most generic and is often used, so I'll stick with that for now.

We can refactor the ngOnInit part like this:

```javascript
ngOnInit(): void {
  this.message$ = combineLatest([this.data1$, this.data2$]).pipe(
    map(([name, job]) => {
      return `${name} is a ${job}`;
    })
  );
}
```

CombineLatest is getting our two observables. When both have emitted something, combineLatest will _emit_ the data. We can then tack on subsequent actions by adding them within .pipe. Within the pipe, we can use all kinds of operators. In this case I used map, which is very similar to a regular JS array.map() function. It will transform the data. In the end, it will emit whatever is returned from the map function!

We can remove the two properties that were holding the data, and convert the message property to an observable (denoted by the \$ at the end of the name). In the html template, we can simply show the message like this: `{% raw %}{{ message$ | async }}{% endraw %}`.

This is less code (which typically means less bugs), easier to understand (once you are a bit familiar with RxJS), not dependant on the type of change detection or on the order the data comes in, not causing memory leaks and just better in almost every single way. Yet, the 'bad' example or variants thereof aren't as uncommon as you might think, especially to those just learning Angular and/or RxJs. Typically, RxJS takes some practice before it 'clicks', but when it does, you feel like you've unlocked a super power!

## On to the next mistake

By now, you should be aware of the four patterns highlighted above. When you encounter them, be vigilant because it might indicate a problem. Once you know what to look for, you can hopefully write Angular a little bit more confidently! Did I miss any common mistakes? Let me know!

_Photo by Joe Chau on Unsplash_
