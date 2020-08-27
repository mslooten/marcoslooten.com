---
title: Creating a Reusable Avatar Web Component
published: true
description: Learn how to write a web component that can be used everywhere
cover_image: web_components.jpg
date: 2020-08-26
---

This avatar component will be a web component. It's a newish technology that over the last year seemed to have gained a lot more browser support. It aims to solve the reusability problem for bigger organisation or ambitious projects: letting developers use components that are compatible with all JS frameworks. After all, they are native JavaScript. That means that there doesn't need to be a component library for each framework (e.g. no separate libraries for React, Angular, Vue, Svelte, you name it), you could just do it with web components. It makes web components highly suitable for a component library.

So let's make one component. We're going to recreate the avatar component I've made in this blog post ([https://marcoslooten.com/blog/creating-avatars-with-colors-using-the-modulus/](https://marcoslooten.com/blog/creating-avatars-with-colors-using-the-modulus/)) and turn in into a web component. As a reminder, this is what it will look like:

![https://thepracticaldev.s3.amazonaws.com/i/1j0j5i6pfdw71egakfgl.png](https://thepracticaldev.s3.amazonaws.com/i/1j0j5i6pfdw71egakfgl.png)

## Create a new web component

There are frameworks for web components, but we're going to build one just with vanilla JavaScript. You might be tempted to name it 'avatar', but that's actually an invalid name. To allow better separation from native HTML elements, web components need to contain a dash. Note how there aren't any HTML elements that contain a dash, so you can consider the dash a visual clue that it might be a web component. Let's call it custom-avatar then. Moving on!

First, create a class named 'CustomAvatar' which extends HTMLElement. Extending is necessary because we need access to all kinds of functionality which comes with the HTMLElement. After the class, we need to tell the browser that there's a new custom element with a certain name ('custom-avatar') and a certain class ('CustomAvatar'):

```js
class CustomAvatar extends HTMLElement {}
window.customElements.define('custom-avatar', CustomAvatar);
```

Although the class name (CustomAvatar) can be any name we want, it's convention to use the same name as our custom element, but in PascalCase (each word capitalized) instead of kebab-cased (with a dash). You can now add the tag to the HTML: `<custom-avatar></custom-avatar>`. Nothing to see yet. Let's make it look like an avatar!

## Adding HTML and CSS to your web component

Inside of the CustomAvatar class, we are going to use the constructor. This method is called when the component is initialized and can be used for markup and styling. We are also going to call super(), which is needed to inherit all the methods and properties from HTMLElement.

```js
class CustomAvatar extends HTMLElement {
  constructor() {
    super();
  }
}
window.customElements.define('custom-avatar', CustomAvatar);
```

Next, we are going to use the Shadow DOM. This is the encapsulated part of a web component: only the web component itself can change it. That means that your web component isn't affected by its surroundings. Let's say I have an h1 tag inside my web component and use the generic styling `<style>h1 { background: hotpink}</style>`. Even if the page around it has an h1 with styling, it will never affect the h1 within my web component (and the other way around).

Now the fun begins and we can add our markup to the shadow DOM. I've added comments to explain what each step does.

```js
class CustomAvatar extends HTMLElement {
  constructor() {
    super();

    // Enable the shadow DOM for this component
    this.attachShadow({ mode: 'open' });

    // Create a HTML template (this is a special tag which can hold markup)
    const template = document.createElement('template');

    // Set the innerHTML to the actual markup we want
    template.innerHTML = `<div class="avatar"></div>`;

    // Create a style element
    const styles = document.createElement('style');

    // Inside the style element, add all the CSS
    styles.textContent = `
    .avatar {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: hotpink;
      border-radius: 50%;
      font-family: sans-serif;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
	`;

    // Append the style element to the shadow DOM
    // shadowRoot is the wrapper of our component
    this.shadowRoot.appendChild(styles);

    // Take the template contents, and copy them to the shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
```

Now you should see a pink circle on the page. We're getting somewhere!

## Add attributes to pass user data

Instead of props or @Input() or whatever you're used to with a framework like React or Angular, we're going to use regular HTML attributes to pass data to our component. We only need the initials, so that we can use the avatar like this: `<custom-avatar initials="MJ"></custom-avatar>`. If you do this, you can access the attributes using JavaScript, e.g. `this.getAttribute('initials')`. Some examples of web components let you retrieve the attributes in the constructor using this method, but that's bad practice (see the spec here: [https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)). A better idea to do it in `connectedCallback`, which is called when the component is loaded.

Even better is `attributesChangedCallback`. This method is called whenever the attributes are updated. Luckily, they are also changed when the component first loads. The initial value of attributes is `null` and once it's ready it will set them to the provided attribute value. `attributesChangedCallback` takes three arguments: name, oldValue, and newValue. Perfect for us! Not only is it a good place to get the initial values, but it will also run again in case the value has changed (and we would need to get a new color for our avatar). Add the following code _outside of the constructor_:

```js
// This is our code to generate a color code from a string
// For more info, see the blog about this technique:
// https://marcoslooten.com/blog/creating-avatars-with-colors-using-the-modulus/

getColorFromText(text) {
  const colors = ['#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00', '#D47500', '#DC2A2A'];
  const charCodes = text
    .split('')
    .map(char => char.charCodeAt(0))
    .join('');
  return colors[parseInt(charCodes, 10) % colors.length];
}

// This static get is needed to tell our component which attributes to watch
// If you don't provide this, it won't work
static get observedAttributes() {
  return ['initials'];
}

// This will run only when our 'initials' attribute changes
attributeChangedCallback(name, oldValue, newValue) {
  // But for future-proofing, I'd like to check anyway
  if(name === 'initials') {
    // Get the avatar div from the shadow DOM:
	  const avatar = this.shadowRoot.querySelector('.avatar');
		// Set the text to the attribute value:
	  avatar.innerText = newValue;
		// And set the background color to the color from the getColorFromText method
	  avatar.style.backgroundColor = this.getColorFromText(newValue);
  }
}
```

## How to make a web component

Now you know how to make a simple web component! We've started by creating a class that extends the HTMLElement and telling the DOM that we have a custom element. Then, in the constructor, we do the initial set up for our component with the default markup and fallback background color. We used DOM methods that existed for quite some time that you might already be familiar with. Lastly, we made use of one of the built-in lifecycle methods of web components, in this case, the attributeChangedCallback which will fire any time one of our attributes is set or updated.

When I was looking into web components, I was surprised at how simple it was. It's not comparable to an entire framework, it's just a relatively small API that you can learn much quicker than Angular or React. However, the syntax can feel a bit clunky if you just get started. Also, it really helps if you are well versed in DOM manipulation (querySelector, createElement, innerHTML, innerText, that sort of stuff) because there will be a lot of that once you start writing web components.

In the end, it may be well worth learning. I'm seeing some large companies adopt this technology more and more. They can share components across teams, no matter the framework used. That is a big win for many. Imagine having to keep three component libraries up to date with the same components, but different frameworks.

If you want to learn more about web components, I'd recommend checking out the following resources:

[The Ultimate Guide to Web Components](https://ultimatecourses.com/blog/the-ultimate-guide-to-web-components)

[Lifecycle Hooks in Web Components](https://ultimatecourses.com/blog/lifecycle-hooks-in-web-components)

[webcomponents.org](https://www.webcomponents.org/)
