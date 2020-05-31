---
title: Creating Avatars With Colors Using The Modulus
published: true
description: Using the modulus to create dynamic colored avatars
cover_image: https://thepracticaldev.s3.amazonaws.com/i/h5ahdfbbknmw5gejvyq5.png
date: 2019-10-07
---

Recently I needed a flexible avatar component for an admin-type dashboard. Administrators should see avatars of all the users under their control. Ideally, the avatars would show pictures of the users, but not everyone will want to upload their photos to the web app. It needed a fallback (that probably will be used more than the photo-version) without images. We will build a basic avatar version that's already pretty cool!

First, we'll be creating a plain HTML and CSS avatar component. Then we will switch to JavaScript and make the color dependant on the initials provided.

> blockquote test
> still testing
> the end

## HTML and (mostly) CSS

We are going to create the basic structure and styling of the avatar. The HTML is just a div with a class and the user's initials inside: `<div class="avatar">AA</div>`. It doesn't look like much now, but wait until we apply some CSS!

Let's start with defining a width and height to make them square. Then we'll add a background color (gray, as a fallback), make it round and add some text styling:

```css
.avatar {
  width: 52px;
  height: 52px;
  background-color: #ccc;
  border-radius: 50%;
  font-family: sans-serif;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
}
```

It's starting to look like an avatar, but the text isn't centered. Now we could use the traditional way to center (using a combination of text-align and setting a fixed line-height), but that technique does not really scale. If we want larger avatars, we'd have to update the line-height again. I decided to use flexbox for this since it will always work regardless of the dimensions. Add the following lines to make it 1. flex, 2. horizontally aligned and 3. vertically aligned:

```css
.avatar {
  /* ... */
  display: flex;
  align-items: center;
  justify-content: center;
  /* ... */
}
```

You can put it anywhere in the `.avatar`-class, but as a guideline I prefer to have positioning rules just below the width and height, and before any color or text styling.

Enough talking, how does it look now? I've put a couple of them side by side to have a look:

![List of gray-colored avatars](https://thepracticaldev.s3.amazonaws.com/i/gmqafo5ifj0shm329r90.png)

It looks like an avatar alright, but there's also an issue that becomes apparent: all users look alike except for their initials. I really want them to have different background colors to be able to better distinguish them.

So how do I determine which background color? At first, my reaction was to just make it random. The colors have no special meaning in this case, so in a way it made sense. But do I _really_ want it random though? Every time someone logs in, the colors would be different. That's not a desirable quality in this case. Should I store the generated values to a database then? It seemed like overkill for something like this. Instead, I decided I did not want them to be _totally_ random; I just wanted them to _look_ random. But I want the initials 'AA' to give the same color every time, for every user. Since it's a web app, already using JavaScript, I decided to write a function to assign a color from a predefined list.

## Enter JavaScript

We are going to write a **pure function**. A pure function is a function that given the same input, always gives us the same output. It should also not have side-effects. If you want to know more about pure functions I recommend this article: [What Is A Pure Function In JavaScript](https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/). For us, the important part is that the function will always return the same value given the the same input. The initials 'MJ' should always return the color '#E3BC00' for instance.

First up, we need to have a list of colors. Here's an array with the HEX color values. You can copy that or create a much larger list if you want. Since we have 26 letters in the alphabet and typically two initials shown in an avatar, that means we have two spots with 26 letters, which yields 26 \* 26 = 676 unique combinations. You could provide as many colors like that but it might be a bit overkill. I decided seven was more than enough:

```javascript
const colors = ['#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00', '#D47500', '#DC2A2A'];
```

In order to set the background color of the avatar, we have to pick a color from that list and return it. To return the second color, we would use `colors[1]`. Next, we need a way to convert our initials to a number between 0 and 7.

Let's start by converting our text to a number. Luckily, there's a function in JavaScript that converts a character to a character code: `charCodeAt()`. It only gives one number per character, so we need to iterate over our initials. To do so, we create the following function:

```javascript
function numberFromText(text) {
  // numberFromText("AA");
  const charCodes = text
    .split('') // => ["A", "A"]
    .map(char => char.charCodeAt(0)) // => [65, 65]
    .join(''); // => "6565"
  return charCodes;
}
```

It's a function that takes one argument, a string which we will name 'text'. Then, we split that string, using `split('')`. The empty string as argument for split means it will split the string at each character, outputting an array of characters like this: `['A', 'A']`. The next step is to transform each array element to a charcode, which we'll do using map. We can chain `.map` to `.split` because the latter returns an array. With map we can transform each element in the array. In the arrow function we get the array value and on the right hand side we return a value, which is the character code. Now, we have an array of character codes. Lastly, we join it together using an empty string as the 'glue' that joins the elements together. Now we have "6565". Notice the quotes, it's a string. We can use parseInt to return a number by modifying the last line:

```javascript
return parseInt(charCodes, 10);
```

## Picking Array Items With The Modulus

Ok, great, that was a lot and now we have `6565`. Our array, however, only has 7 items in it. This is where the **modulo operator** comes in (this one: `%`).

If we have the following statement: `6565 % 7`, the modulo will first check how many times 7 fits into 6565 completely (so no decimals). Then it returns what remains after that division. 6565/7 = 937.8... So 7 fits fully 937 times. That's 6559 (7 times 937). When we subtract that from 6565, we end up with 6 (this is called the **modulus**). The modulo operator will always return a value between 0 and the value on the right side minus one. In this case, between 0 and 6.

Using the modulo we can use any number we want and make sure it sequentially picks an item from the array. A perfect way to get a color based on your initials! Let's see how we can use that to get a color from the array using initials:

```javascript
colors[numberFromText('AA') % colors.length]; // => '#DC2A2A'
```

Let's examine the stuff within the square brackets first: `numberFromText('AA')` returns 6565. `colors.length` returns 7. If we take those values and calculate it, using the modulo operator, `6565 % 7` returns 6. The entire statement within the square brackets returns 6. You can now see the similarity to the example at the start (`colors[1]`); in this case, it's `colors[6]` and it will return the 7th array element (at index 6), which is `#DC2A2A`. Check it out with other values, it will always give us an element from the array and it will always be the same given the same input ('AA' always returns #DC2A2A, etcetera).

Awesome! Now we can finish it off by returning a color and modifying the HTML elements:

```javascript
const avatars = document.querySelectorAll('.avatar');

avatars.forEach(avatar => {
  const text = avatar.innerText; // => "AA"
  avatar.style.backgroundColor = colors[numberFromText(text) % colors.length]; // => "#DC2A2A"
});
```

First, we're getting the avatars from the DOM. This is now a NodeList, which is similar to an array but we can't use stuff like map. Fortunately, `.forEach` is available to us. In that function, we read the innerText property of the `.avatar` DOM-element and store it in a constant called 'text'. This gives us the text of the avatar (in this case the initials). Then we modify the backgroundColor property directly, setting it to the value returned from the function we just created. Now your avatars should have cool colors.

That's it! We're done, our avatars now look like this:

![List of colored avatars](https://thepracticaldev.s3.amazonaws.com/i/1j0j5i6pfdw71egakfgl.png)
Here's the full code:

HTML:

```html
<div class="avatar">AA</div>
```

CSS:

```css
.avatar {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
  border-radius: 50%;
  font-family: sans-serif;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
}
```

JavaScript

```javascript
const colors = ['#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00', '#D47500', '#DC2A2A'];

function numberFromText(text) {
  // numberFromText("AA");
  const charCodes = text
    .split('') // => ["A", "A"]
    .map(char => char.charCodeAt(0)) // => [65, 65]
    .join(''); // => "6565"
  return parseInt(charCodes, 10);
}

const avatars = document.querySelectorAll('.avatar');

avatars.forEach(avatar => {
  const text = avatar.innerText; // => "AA"
  avatar.style.backgroundColor = colors[numberFromText(text) % colors.length]; // => "#DC2A2A"
});
```

## Recap

We created a custom avatar by starting with HTML markup to give it structure. Then we added CSS to make the div square, round the corners, give it a background color and some text styling. After that, we went on to JavaScript. We made a pure function that returns a number, which is the character codes for the input string glued together. Then, using the modulo operator, we got a color value from the array of colors and assigned it to the avatar in the DOM.

This is one of the many use cases of the modulus. I always find it cool if I get to use it. Do you use the modulus in your code, and what does it do? Let me know in the comments or on Twitter. Thanks for reading!
