---
title: 'State Machines: A Simple Introduction'
published: true
description: I'd heard about state machines, but it didn't really click for me. Until I made a mistake I could've prevented with it. Here's my perspective on state machines now.
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/di194yr3gfyz2qaddro5.jpg
date: 2020-02-24
---

State machines are a very useful concept to help write reliable software. By reducing the number of possible states and controlling transitions between states, your application will be more predictable, reliable and easier to work on. But I can’t help notice that some people are deterred by the name and think it’s all very complicated, or even that it’s not useful for them. I had heard about state machines some time ago and was intrigued, but somehow didn't really think it was that useful for me. Spoiler alert: I was wrong.

## What problem are we trying to solve?

Let's highlight an actual issue I ran into a while back (note: this app was not in production yet). I was tasked with adding a form to a page. Simple enough, I added a form and slapped on the button we already had in our component library; happy I was able to reuse something. Everything was fine and we merged it. A couple of days later, our product owner approached the team and showed us something: he was using the form, but instead of saving it once, he kept clicking the button rapidly. I instantly knew I messed up: it kept saving the same data to the backend, which was responding slower and slower every time he'd hit 'save'.

Back to the drawing board then! I added a 'loading' state to the button using a boolean. When we received a response from the backend, only then would 'loading' be false again. In the meantime, I prevented any click event while the button was in the 'loading' state so that it was not possible to submit the form multiple times. Once again my code got reviewed and merged.

About a week later I get approached again. The requirements changed. At first, _all_ form fields had to be optional. Now, you had to have a certain combination of fields filled in. Otherwise, our database would fill up with empty forms. A new ticket was created and I got to work. Now I had to add a 'disabled' state to our button. This is the point where I started to sense that the code was becoming more complex and harder to maintain.

![Sketching out some buttons and their booleans](https://dev-to-uploads.s3.amazonaws.com/i/pknuxq3y7pn5h9t7on6p.jpg)

I now had two booleans, yielding four combinations (true - true, true - false, false - true, false - false), but I thought we would probably be adding a 'success' state to the button in the near future. Then I'd have three booleans and eight different combinations. What if we would add a couple more booleans to the button? For instance, another loading state if things were taking really long ('This is taking longer than expected...') and a failure state if the network request failed? The possible combinations of booleans would skyrocket. Six booleans would already yield 64 combinations! Look at the following (pseudo) code that saves the form:

```javascript
let loading = false;
let success = false;
let disabled = false;
let failure = false;
let loadingLong = false;

submitData() {
  if (
    loading === false &&
    disabled === false &&
    loadingLong === false
  ) {

    loading = true;
    setTimeout(() => {
      loadingLong = true;
    }, 5000);

    // make the actual POST call
    // Check return data

    if (data.success) {
      loading = false;
      loadingLong = false;
      success = true;
    }

    if (data.error) {
      loading = false;
      loadingLong = false
      failure = true;
    }
  }
}
```

You can see how this can get out of hand: I have to make sure I have the right combination of booleans before doing something, and I have to make sure I modify them all correctly when something changes. It's so easy to introduce bugs here, simply because I might forget to update a boolean or I forget to check one. It also gets unreadable pretty quickly.

**State machines can help fix these problems:**

- it can reduce the number of possible states (no longer 64 possible combinations because we used booleans)
- it can control the transitions between states (so that we no longer have to think about resetting all the other booleans)

Let's dive a little deeper into both.

## Reducing the number of possibles states

In the above example, I have a button that has a number of states we (explicitly) defined:

- loading
- loading long
- disabled
- success
- failure

It also has an implicit state: the 'default' state. In the above example, we're in the default state when everything is 'false' and then it's just a regular button.

So that makes six states. Notice how we have defined five booleans. That gives us 2 ^ 5 = 32 combinations of booleans. But note that I'm only interested in six distinct states. I don't really care about the other combinations that might exist. If the button is 'loading', the other states don't matter to me – it simply must look and act like it's loading. When people talk about state machines, they're most likely talking about **finite** state machines. This is exactly what's going to help us here. I only care about six possible states. Why express that with booleans? Let's just introduce a single state variable and have that be the ultimate source of truth, rather than some arbitrary combination of booleans:

```javascript
let buttonState = 'loading';
```

If you're using TypeScript you could give it an enum with the possible state values to enforce the right strings, but even without enforcement, this is way cleaner. Now our application can have much better logic:

```javascript
switch (buttonState) {
  case 'loading':
    // do stuff, e.g. prevent clicks
    break;
  case 'failure':
    // do stuff, e.g. show error message
    break;
  // ... etc
}
```

In most cases, we only care for a particular set of states. Defining those and having a single variable holding that state reducing the complexity immensely, in our example going from 32 to six states. Every code that is dependent on that state can be written to be much more simple and robust, thereby prevent bugs and making the development less intimidating.

## Controlling state transitions

We talked about the benefits of finite states. But that still leaves the door open for certain errors. For instance, in the button example, can you go from 'failure' to 'success'? From 'loading' to 'disabled'? From 'success' to 'loading'? There's nothing that will keep that from happening in the current situation. That's where the machine can help us.

We can make a state machine responsible for all transitions on the state of our button. For actually implementing this, have a look at the excellent [XState](https://xstate.js.org/). I've created a simplified button state machine with four states (idle, loading, success and failure). Our machine object may look like this:

```javascript
const buttonMachine = Machine({
  id: 'button',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICK: 'loading'
      }
    },
    loading: {
      on: {
        RESOLVE: 'success',
        REJECT: 'failure'
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: 'loading'
      }
    }
  }
});
```

Don't be intimidated by that, there are just a few things you need to know. This state machine has, on the top level, three properties:

- id (to uniquely identify it, irrelevant for now)
- initial (the state it starts in)
- states (another object holding the different states)

The property 'states' is another object with all of the possible states defined, in this case idle, loading, success and failure. You can make up what they are called here, as long as it's a valid Javascript object property. Within each state, there's an 'on' key. This is where XState will look for transitions. Transitions are the capitalized words and define the next state when that transition happens.

Say we're in the default 'idle' state. Looking at the available transitions, I see 'CLICK' as the only one. The value of 'CLICK' is 'loading'. This means that when I'm in the idle state I can only transition to 'loading', and it only happens when I provide the machine with the right event ('CLICK'). This is done like so:

```javascript
const initialState = buttonMachine.initialState;
const nextState = buttonMachine.transition(initialState, 'CLICK');
```

Fortunately, there's an easier way to look at this machine. Go ahead and copy the state machine above, and then go to the [XState Visualizer](https://xstate.js.org/viz/), paste it in on the right and click on 'UPDATE'. Now you can see your state machine and even interact with by clicking on the events. Here's how my button state machine looks:

![Visualization of the button state machine](https://dev-to-uploads.s3.amazonaws.com/i/tcpm83zx9qkcwrsmnhdd.gif)

By making XState responsible for all state and state transitions, you can never end up with a state that you haven't explicitly defined. It's also deterministic: the state is a result of the previous state and the event. Given the 'idle' state, the 'CLICK' event will always give us the 'loading' state. There's no ambiguity there, making state transitions relatively painless.

## Recap

The problem of having a naive form of state management, for instance by using lots of booleans, can be solved by using state machines. When we define a limited (finite) number of states, we reduce complexity and increase reliability. When you combine that with making the state machine responsible for the transitions, you make it so much more robust. It ensures you only ever have one state at a time, that it's one of your predefined states and that it's only possible to transition from a certain state to another if we explicitly enable that. It also makes testing easier and has a number of other benefits.

I highly recommend checking out XState and trying to use it in your next project if it involves anything more complex than a single boolean!

**Recommended reading**:

- Follow [David Khourshid](https://twitter.com/davidkpiano) (creator of [XState](https://xstate.js.org/)) on Twitter and read everything he publishes if you want to know more about state machines
- [Enumerate, Don't Booleanate](https://kyleshevlin.com/enumerate-dont-booleanate) by Kyle Shevlin
- [State Machines in React](https://gedd.ski/post/state-machines-in-react/) by Dave Geddes
- [Implementing a simple state machine library in JavaScript](https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript) by Kent C. Dodds

_Header image by Franck V. on Unsplash_
