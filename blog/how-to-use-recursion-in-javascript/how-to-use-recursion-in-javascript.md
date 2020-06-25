---
title: How to use recursion in JavaScript?
published: true
description: Learn how to understand recursion in JavaScript and create your own recursive functions.
date: 2020-06-24
cover_image: recursion.jpg
---

## What is recursion in JavaScript?

When were talking about JavaScript, recursion means a function that calls itself (again). Note that it's not reserved for programming: you can even do recursion with a little story. There's a pretty good example of that floating around the internet:

```
A child couldn't sleep, so her mother told her a story about a little frog,
    who couldn't sleep, so the frog's mother told her a story about a little bear,
         who couldn't sleep, so the bear's mother told her a story about a little weasel...
            who fell asleep.
         ...and the little bear fell asleep;
    ...and the little frog fell asleep;
...and the child fell asleep.
```

_Source: [https://everything2.com/title/recursion](https://everything2.com/title/recursion)_

This is a sentence that keeps repeating itself, with just the animal changed. Once it reaches a certain condition (being asleep), it passes that value back to the parent function, until it's reached the final (first) function. You can view it as a function that keeps on doing a thing, until the desired outcome is reached. Then it passes that outcome back to the initial function.

Don't worry if this sounds vague. Just remember that **recursion is a function calling itself** from within the function.

## When to use recursion?

### Can't I just use a loop?

In almost every case, you can use a while loop instead of recursion. There are some situations that are more suited to recursion than others though. For now, the important take away is: yes, in many cases you can use a loop, but in some cases recursion is preferred. Once you get the hang of it, you will find that **recursion can be a pretty elegant concept** that's often clearer than a while loop (in my opinion anyway).

### A recursion example with JavaScript

Let's look at an example where I think recursion shines. We have to generate a list of (pseudo) random numbers with 5 digits. It will be the passcode you have to say at the door to get into this exclusive party! The bouncer can never remember all the codes, but he's got a calculator. He asks you to make sure each number is divisible by 11. That way, he can always check if he is given a valid number.

There may be math tricks to come up with seemingly random numbers that are divisible by 11, but we're going to brute force it. One out of 11 numbers randomly generated will be divisible by 11, right?

First, create a function that returns a random number with 5 digits. That means it has to fall between 10,000 and 99,999:

### Generating a random number between two values

```jsx
function generateNumber() {
  return Math.floor(Math.random() * 90000) + 10000;
}
```

Here, we generate a random number between 0 and 1 and multiply it by the difference between our min and max + 1. The highest value is just below 90,000 (`Math.random()` will never return 1) and the lowest is 0 (it _can_ return 0). We round it down because don't need any decimals and add the missing 10,000 back. Now we have a number between 10,000 and 99,999.

We need 100 passcodes for the party, so let's generate them and store them in an array:

```jsx
const passcodes = [];

for (let i = 0; i < 100; i++) {
  passcodes.push(generateNumber());
}
```

This will give us 100 numbers, but not the just the correct ones. We need to check if the random number meets our condition. Let's modify the generateNumber function:

```jsx
function generateNumber() {
  const number = Math.floor(Math.random() * 90000) + 10000;
  if (number % 11 === 0) {
    return number;
  }
}
```

Now it uses the modulus to check if the number is divisible by 11. The modulus keeps dividing by 11 until the remainder is smaller than 11, and returns that value. So for a number to be divisible by 11 (no decimals), it needs to return 0. Want to know more about the modulus? I wrote about [creating random avatar colors with the help of the modulus](https://marcoslooten.com/blog/creating-avatars-with-colors-using-the-modulus/).

The problem with the above function is that when the number isn't divisible by 11, it returns 'undefined' (which is the default return value for any function). So we will end up with an array with a bunch of empty spots and just a handful of numbers. Instead, I want to modify my function so that it returns a number that meets my requirements _every time_!

### Adding recursion to our function

We already have the 'success' condition defined (a number divisible by 11), so we can use the good old 'else' clause to do something if we get the wrong number. If the number isn't correct, I want to generate another one. Even though we're inside of the generateNumber function, we can actually call it again – we can add recursion to it!

```jsx
function generateNumber() {
  const number = Math.floor(Math.random() * 90000) + 10000;
  if (number % 11 === 0) {
    return number;
  } else {
    return generateNumber();
  }
}
```

What you see here is that I call the same function, and return it. We're now one level deep.

Let's call the first function call the 'parent' and the second function call, made from within, the 'child'. When the child does generate a number divisible by 11, it will return that number.

The parent function receives that value in the place where the child function was called (on the line `return generateNumber()`). The parent will then also return the value it was given from the child. Now, in the place where we originally called the function the first time, we will receive that number and we can store it in the array.

So we call one function ourselves, and that one function can call itself again from within, if it's needed. The child will pass back the value to the parent, who will pass it back to where it was called. This goes as deep as it needs to go. If the child does not have the right number, it could do another function call. If that one doesn't have the right number, it could also do another function call. This can go on until we meet our condition (divisible by 11), then we return a value which gets passed back.

- Warning: You could easily create an infinite loop here if you don't have any conditions. If we didn't have the if statement, we would keep going until we run our of resources and crash our browser.

If this seems confusing I don't blame you. You don't often see recursive code and it takes some mental gymnastics to grasp it. If it's not clear, I've got another example. Otherwise, feel free to skip to the end!

## Another (code and non-code) example of recursion

Let me give you another example to make it more clear:

Imagine yourself at a dinner where you are seated at a large table. You ask the person sitting to your right to pass the bread basket. If that person has the basket within reach, she will pass it back to you. If she doesn't, she will ask the person sitting to her right. This goes on until we find the person with the bread basket within reach. They will pass it back the person on their left, who will also pass it on, until it reaches you.

If we were to convert this to code, it might read something like this:

```jsx
function passTheBreadBasket() {
  if (basketIsInReach === true) {
    passItToThePersonWhoAskedMe();
  } else {
    askAnotherPerson();
  }
}
```

So each person that is asked for the basket, is a function call. They have to 'decide' if they can pass you the basket directly, or if they have to ask someone else and wait for their response. If it's far away, you may well have five people waiting on the basket to pass it back to you.

The same thing is happening in our function:

- we have a task
- if we can complete it directly, we will
- if not, we will try again (ask another person / run another instance of the function) until we can complete

So instead of thinking of recursion as 'going deeper' or 'nesting', you could also look at it like a horizontal line where you make a request going right, and the response will come back to you (going left).

## Summary and takeaways of recursion

If your head hurts right now I don't blame you. Recursion is really something that takes a little while to grasp. That's totally normal. By now you have seen a few examples of it and perhaps you can already envision some use cases. To finish, I'd like to summarize recursion one last time:

- recursion is the process of a function calling itself
- it has to have a defined end condition that can be reached with certainty, because
- it's easy to create an infinite recursion by accident and crash your application
- it will pass back the right value immediately; or it will call itself again until it does have the right value

I'd love to hear your use cases for recursion if you can think of any. It would also be a cool exercise to recreate our number-generating function without recursion, using a while-loop for instance.
