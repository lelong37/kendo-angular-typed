# Kendo, AngularJS and TypeScript
by: [Long Le](http://twitter.com/lelong37)

What does the world look like in TypeScript? What would you gain or loose coding in TypeScript vs. ES6? If anyones been pondering on this question, today we'll do a deep dive to help you sort these answers out yourself. Best way to illustrate this is with code, so let's dive right into it. We'll start with converting one of Kendo UI's sample apps, and the winner will the their Layout Diagram App, this would be a good candidate since it's slammed with Kendo UI controls of all sorts. With many of us developing with ng (AngularJS), we'll go ahead and refactor it from it's jQuery implementation to ng in the process as well. For those of us that aren't using ng, simply ignore the specific ng bits.

## Preparation
First off, let's go ahead and address separation of concerns, we'll go ahead and separate the view from the any logic and place any logic in the view model. 

Before TypeScript & AngularJS:

<script src="https://gist.github.com/lelong37/bd9addd33e7a0a6a4c8a.js"></script>


After TypeScript & AngularJS

