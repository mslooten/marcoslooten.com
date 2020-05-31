---
title: Destructuring Arrays in JavaScript
published: true
description: Learn the power and flexibility of array destructuring
date: 2019-09-07
---

Chances are you'll run into a situation where you want to store some array values in separate variables. Sounds easy enough, something like `const secondValue = array[1]` might come to mind. But there's a different way of doing that available to us: destructuring. It's a cleaner syntax, less confusing than the old way of doing it's shorter too. Let's see what we can do with destructuring.

## Assign All Values to Variables

Say we have an array with the following elements (which are always in the same order):

```javascript
const breakfast = ['Coffee', 'Croissant', 'Sunny side up'];
```

We need to store the values in separate variables for easier use later on. The 'old' way of doing it uses the index of the items, like so:

```javascript
const drink = breakfast[0];
const bread = breakfast[1];
const eggs = breakfast[2];
// drink => 'Coffee'
// bread => 'Croissant'
// eggs => 'Sunny side up'
```

It's not too bad and there's nothing wrong with it, it's just that array destructuring is cleaner, more flexible and you are probably going to see more and more code use the destructuring syntax. Look at this one-liner:

```javascript
const [drink, bread, eggs] = breakfast;
// drink => 'Coffee'
// bread => 'Croissant'
// eggs => 'Sunny side up'
```

That's way less code and very readable. You are declaring and assigning your new variables in an array because you are destructuring an array. The first array value will be assigned to the first variable, and so on.

## Assign Only Some Items to Variables

Of course, we don't always want to use everything from the array. If we only need the first two items, it's easy enough to omit the last variable declaration and just assign to two variables. But what if you want the first and the third value, skipping the second? Look at this example omitting some values:

```javascript
const [drink, bread] = breakfast;
// drink => 'Coffee'
// bread => 'Croissant'

const [drink, , eggs] = breakfast;
// drink => 'Coffee'
// eggs => 'Sunny side up'
```

In order to skip an element, you skip declaring and assigning a variable. In the first case, this is harder to see because the first elements are also the first two array items. But it's actually the same as `const [drink, bread, ] = breakfast;`, in other words, skipping the last item by having an empty spot in the array. In the second example, it's more clear because we're skipping the middle element. It looks a bit weird at first, but you'll get used to it quickly.

This image can help you visualize skipping items in destructuring:

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/8anuamfqq7v5gplvul44.png)

## Assign Some Items, Keep The Rest

Lastly, what if we got a lot of array items where we need to have the first three, but also want to keep the rest of the items in a variable to use later? Let's say we again have an array with the same three items, but also the time you ordered breakfast, the waiter who took your order, the total price and the number of your table:

`const breakfast = ["Coffee", "Croissant", "Sunny side up", "08:38", "Sally", 9.15, 7];`

We want to have three variables, one each for the first three items. We also need the rest, but without the first three items. We're also not concerned with storing the values in separate variables. In this case we can use the rest-operator (the three dots: ...):

```javascript
const [drink, bread, eggs, ...meta] = breakfast;
// drink => 'Coffee'
// bread => 'Croissant'
// eggs => 'Sunny side up'
// meta => ["08:38", "Sally", 9.15, 7]
```

So now, the constant 'meta' will contain an array of all the remaining values of the original array that weren't destructured to their own variables. The rest operator and the variable it's used on need to be the last items in the destructuring. You can see it visualized here:

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/gatlzj7mlanizblem5e7.png)

## Bonus

Bonus: you can also swap variables with destructuring:

```javascript
let x = 10;
let y = 20;

[x, y] = [y, x];
// x => 20
// y => 10
```

## Recap

Here's a quick cheat-sheet of array destructuring:

```javascript
// Assigning array items to variables
const [a, b, c] = [123, 'second', true];
// a => 123
// b => 'second'
// c => true

// Skipping items
const [, b] = [123, 'second', true];
// b => 'second'

// Assigning the first values, storing the rest together
const [a, b, ...rest] = [123, 'second', true, false, 42];
// a => 123
// b => 'second'
// rest => [true, false, 42]

// Swapping variables
let x = true;
let y = false;
[x, y] = [y, x];
// x => false
// y => true
```
