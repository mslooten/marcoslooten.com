---
title: 10 Quick Git Command Line Tips
published: false
description: Using git with the command line isn't as hard as you might think. Personally, with this 10 commands I can do all daily git related tasks.
date: 2021-10-02
cover_image: git.jpg
---

First, let get this out of the way: I don't think using the command line is better than using a GUI for git (like Tower, SourceTree, gitKraken, github Desktop, etc). I personally do find it easier, because I always have a terminal window open in my editor (VSCode). Once I memorized just a few commands, I felt like the workflow was quicker with less friction (not having to switch applications). If you want to give it a try, I'd say the following commands are enough for most daily use cases!

## 1: Add (stage) files

From the source code directory, you can add files to be staged (staged filed will be included in your commit):

`git add .`

If you just want to add a specific folder or file you can do so as well:

`git add path/to/myFolder`

`git add path/to/myFile.ts`

Pro tip: use tab while typing to autocomplete directory and file names.

## 2: Create a commit

Once you've staged your changes with `git add`, it's time to create a commit. Simple use the following:

`git commit -m "Your message"`

Adding a message is recommended. Writing a good message is hard, but makes it much easier down the line and for your team members to understand what is going on. I like the approach of finishing the sentence: 'Once merged, this commit will...'. So my commit message may look like this: 'Add the datepicker component to the homepage'. In many teams, it's expected that you will also add the (Jira) ticket number as a prefix in the message.

## 3: Push your commit

Once you've done the previous step, don't forget to push. Sometimes people forget, but then there's no backup for your code if your laptop crashes and coworkers cannot checkout your code (say if you're ill, on holiday or if they just want to collaborate). Pushing is easy.

`git push`

## 4: Making sure you're in sync with remote

Use `git fetch` to make sure you're up to date. That way, your local git knows what branches and commits there are.

## 5: Switch branches

Switching branches can be done with:

`git checkout branch-name`

Again, you can use the tab key for autocomplete on the branch name!

## 6: Creating a new branch

Very similar to the previous command, this one adds a flag to create a new branch:

`git checkout -b branch-name`

## 7: Save changes without committing them

If you're working on a branch, and need to switch to another branch, you can save your work easily. Of course you can commit, but sometimes it's a work in progress that you don't want to commit. Then you can use stash:

`git stash`

When you're back on the relevant branch and want to have that code available again, use the following:

`git stash apply`

## 8: Merge changes

If you're working on a feature, sometimes the development branch gets updated. It's good practice to often merge that in to prevent large conflicts. You can use the following syntax:

`git merge origin/branch-name`

An often made mistake is replacing the slash with a space. It will not return an error, but it will not merge the branch you want (instead it will merge the default branch). So always use a slash between 'origin' and the branch name.

If there are conflicts, you can manually fix them in the conflicted files and then add & commit them. After that, you should be good to go.

## 9: Push to a remote branch that doesn't exist yet

Say you've created a new branch locally that doesn't exist in the remote yet, git will show an error when you try to push. They suggest to use the following syntax: `git push --set-upstream origin branch-name`, but there's a shorthand available:

`git push -u origin branch-name`

## 10: Check out a specific commit

It's like turning back time to that specific point in history. Just a week ago I needed to check out some commits, because something was broken but we didn't really know the cause. After checking a few commits I found the culprit. It's also very useful if you have a couple commits that you want to disregard. The syntax is:

`git checkout hash`

Every commit has a hash, that's the alphanumeric string that belongs to it. For instance, something like b8f5439. You can view them with `git log` or in your repository web page.

## Enough commands to be dangerous

Using these commands (not even 10 if you just count the 'base' commands without the flags or parameters) you can absolutely do all daily git tasks. This is all I use on a daily basis and I can confidently say that for about 99% of the cases, this is enough. In the odd case that there's something more complex going on, I can always google git commands or open a git UI program.
