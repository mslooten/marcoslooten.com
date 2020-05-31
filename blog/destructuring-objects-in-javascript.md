---
title: Destructuring Objects in JavaScript
published: true
description: Learn the destructuring syntax in modern JS
date: 2019-09-11
---

Just like array destructuring, object destructuring is a cleaner and more concise way to assign values from an object to a variable. If you haven't yet, I recommend you check out my previous post on [array destructuring](https://marcoslooten.com/blog/destructuring-arrays-in-javascript/) (but it isn't necessary to follow along). Let's explore object destructuring.

## Assign Values to Variables

```javascript
const lunch = {
  starter: 'Soup',
  main: 'Avocado toast', // I'm a millenial so I kinda have to =)
  drink: 'Beer'
};
```

We have a lunch order from a restaurant. The items need to be saved in their own variables for easier use later on. You could use the dot or bracket syntax for that:

```javascript
const starter = lunch.starter;
const main = lunch['main'];
```

For this, destructuring is a bit cleaner syntax. In the next example, I'm destructuring the entire object to separate variables. Because it's an object, the left hand side of the declaration needs to resemble an object too, like so:

```javascript
const { starter, main, drink } = lunch;
// starter => 'Soup'
// main => 'Avocado toast'
// drink => 'Beer'
```

You are not actually declaring an object, it's just the destructuring syntax. The example above is typical usage of object destructuring, but it's also a little confusing. That's because it uses _object shorthand_ notation, which means the **key** from the object you are using will also be the **name** of the variable. What's happening in the example is that we take the value from the key 'starter' (so that's `order.starter` or `order['starter']`), and assign that to a variable that's also called 'starter'. This helps you to prevent repeating the same name (`const { starter: starter } = order;`), which can be convenient, but not always.

## Assigning Values to Different Named Variables

Now this might be a little confusing, because the syntax is as follows:

```javascript
const { keyFromObject: newVariableName } = object;
```

I think this may take a while to get, at least it did for me. You actually need to have the key from the object as the key in the assignment and the new name as the value of that. Most of us are used to the left hand side of things being a variable name (think of declaring new variables, you'd have `const name = 'Marco'`). But in destructuring an object, you need the key from the target object first (before the colon) to get the value you want. Then you assign the variable name as the value on that key (after the colon).

```javascript
const { main: mainMeal, drink: beverage, starter: starterMeal } = lunch;
// starterMeal => 'Soup'
// mainMeal => 'Avocado toast'
// beverage => 'Beer'
```

One of the advantages of objects over arrays is that the order does not matter. The same goes for the destructuring, as long as the key matches to a key in the object. In the above example I switched around the order and it works just fine. Skipping items is very simple, just omit them!

## Assign Only Some Values, Keep The Rest

Like array destructuring, object destructuring supports the rest operator (...) to enable you to store everything you don't want to destructure all at once.

```javascript
const { starter: starterMeal, ...restOfMeal } = lunch;
// starterMeal => 'Soup'
// restOfMeal => { main: 'Avocado Toast', drink: 'Beer'}
```

The rest-variable will then contain an object with all the remaining key-value pairs. This is useful if you need some values from the object, but want to keep everything you didn't assign for later use. If you had to use the original object, you would still have the old values you already destructured in it. That makes it hard to keep track of the values that matter to you. Using the rest operator resolves that, giving back an object with just the values that weren't destructured.

## Nested Objects

With object destructuring, you have a nicer syntax to get specific values from an object. So how do you destructure from more complex, nested objects? Take a look at the following lunch order. It's an object with a nested object ('food') and an array ('drinks').

```javascript
const lunch = {
  food: {
    starter: 'Soup',
    main: 'Avocado toast'
  },
  drinks: ['Beer', 'Water']
};
```

Remembering that object destructuring syntax needs to follow the structure of the object, let's try to create that on the left-hand side:

```javascript
const {
  food: { starter, main },
  drinks
} = lunch;
// starter => 'Soup'
// main => 'Avocado toast'
// drinks => ['Beer', 'Water']
```

What happens here is that `food:` finds the key 'food' within the object. Now we have access to our sub items 'starter' and 'main'. Then you can access them just like you would a simple, one-dimensional object. Don't forget the closing curly bracket! This syntax can get a bit confusing quickly though. There's always the dot-syntax (or bracket syntax) as a backup:

```javascript
const { starter, main } = lunch.food;
const { drinks } = lunch;
// starter => 'Soup'
// main => 'Avocado toast'
// drinks => ['Beer', 'Water']
```

Say we only want to destructure from a specific sub-object, we can do it like the above example. Although it combines destructuring and the old dot-syntax, I prefer it slightly to 100% destructuring for complex objects. I personally think it's a little more readable. But both aren't wrong, so feel free to choose the syntax you're most comfortable with (or the one your team dictates). If you find you're going multiple levels deep, that's probably a sign that you're trying to destructure too many things at once.

## Cheat sheet

Object destructuring is pretty cool and I think it might be a little bit simpler than array destructuring. Still, I want to recap with a simple overview of the possibilities:

```javascript
// Using shorthand notation
const { a, b, c } = { a: 1, b: 2, c: 3 };
// a => 1, b => 2, c => 3

// Using named variables
const { a: first, b: second, c: third } = { a: 1, b: 2, c: 3 };
// first => 1, second => 2, third => 3

// Storing the rest
const { a, ...others } = { a: 1, b: 2, c: 3 };
// a => 1, others => {b: 2, c: 3}

// Nested objects
const obj = { parent: { a: 1, b: 2, c: 3 }, anotherParent: { d: 4, e: 5 } };
const {
  parent: { a, b, c },
  anotherParent: { d, e }
} = obj;
// a => 1, b => 2, c => 3, d => 4, e => 5

// Combining shorthand, naming, rest and nesting:
const obj = { parent: { a: 1, b: 2, c: 3 }, anotherParent: { d: 4, e: 5 } };
const {
  parent: { a: newName, b },
  anotherParent: { ...anotherParentValues }
} = obj;
// newName => 1
// b => 2
// anotherParentValues => { d: 4, e: 5}
```
