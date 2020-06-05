---
title: 'Dealing with spammy newsletter subscribers: The first battle'
published: true
description: My ongoing fight against spam subscribers to my newsletter
date: 2020-06-05
cover_image: /assets/mathyas-kurmann-fb7yNPbT0l8-unsplash.jpg
---

When I updated my personal website, I added a mailing list signup form. I wanted to be able to update people when I post new stuff and this seemed like a good way. But after the first day I already had a lot of subscribers. Great! What am I complaining about?

**They're fake.**

I didn't really announce my website update and looking at the analytics, a large portion of visitors signed up for my mailing list. If you do some research on conversion rates, you'll find out quickly that almost everything is below 5% conversion rate (for a newsletter, I'd be extremely happy with 1%). But more than 50% of visitors were signing up for the newsletter!

A quick glance at the subscriber list confirmed my suspicions: most email addresses looked fake. One of the tells is an address with random numbers. So marco9873245@gmail.com is probably fake. marcoslooten.com@somedomain.com obviously too. Some are more realistic though, following a very clean format like [firstname].[lastname]@[gmail or yahoo].com.

> It's a fact of life that when you place a form on the internet, some bot is going to find it and fill it with spam. For mailing lists, that's especially bad. Fake subscribers means that the deliverability of your mails may suffer and (if you care about that sort of stuff) metrics such as open rate will be unreliable.

## Time to battle these spammers.

Filtering the subscribers out after the fact is hard. Some of the fake email addresses are pretty convincing and the last thing we want is to remove actual subscribers. I wanted to prevent it as much as possible. One tactic is to use a captcha, where the user has to type over letters from an image or click squares with traffic lights. I did not want that. It's a horrible user experience and the code needed may slow down the page. The sign up form is on every page on my blog, so that would be pretty bad.

### The Classic Honeypot

As my first tactic, I opted for the classic honeypot.

I remember using plugins that added a honeypot to forms in WordPress almost a decade ago. But the principle is still solid: you add a field in your form, and you make it invisible with CSS (display: none). Anytime that field gets filled in, it must be a bot because no actual person filling in the form will see it.

Depending on how you handle the form, you could stop the form from submitting or you could go to your email software and manually delete anyone who has the honeypot filled in.

This (still) works very well. In order to tell the form is hidden, the bots would have to load the CSS and parse the page in a more expensive way. I suspect this will stop most of the spam. The first results are encouraging. In my mailing list software (I use [buttondown.email](https://buttondown.email)) I tagged them with the tag named 'confirm'. I named it that way because it also shows up in the form HTML and I want to encourage the bots to definitely check that checkbox!

You can see from the moment I added the honeypot, I start to get subscribers with the spam tag. Since making the screenshot and writing this sentence I already got two more.

![List of subscribers with spammers tagged](/assets/spammers.png)

### What's next?

Now that I have confirmed this is working, the next step would be to prevent the form from submitting altogether. Currently I need to manually clean them out and that is not really nice. But I will monitor this situation a little longer to see just how effective it is.

If you want to stay up to date with my battle against the spambots in my mailing list, you can sign up for that very mailing list on the bottom of this page 😃
