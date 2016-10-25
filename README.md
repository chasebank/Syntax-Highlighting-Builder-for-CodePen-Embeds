# Syntax-Highlighting-Builder-for-CodePen-Embeds
This is a tool to help create custom syntax highlighting for embedded CodePens.

More details on my CodePen blog [here](http://codepen.io/chasebank/post/custom-syntax-highlighting-on-codepen-embeds), or quick instructions below:

**Instructions**

1. Fork [this pen](http://codepen.io/chasebank/pen/EKyGKN).
2. Play with the colors to your heart's content. Have fun. Go crazy.
3. Take a look at the URL in your browser's address bar. It should look something like <q>http://codepen.io/USERNAME/pen/EKyGKN</q>
4. Add .css to the end, so it now looks like: <q>http://codepen.io/USERNAME/pen/EKyGKN.css</q>
5. Highlight the entire url, and copy it to your clipboard.
6. Head over to your [Embed Theme Builder](http://codepen.io/user/embed/builder/public). Whether you're editing an existing theme, or creating a new one, in the bottom left hand corner, you'll find a field labeled "Custom CSS". Paste that copied URL into the field and save the theme.

The .css link is live, which means you can return to your forked pen and make further edits, and the saved changes will automatically propagate to all pens using that theme.

Note: this is using LESS with `@` variable syntax. Easily changable to SCSS...
