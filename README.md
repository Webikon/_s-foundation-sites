_s-foundation-sites
===================

Hi. I'm a starter theme called `_s-foundation-sites`, or `underscores with foundation`, if you like. I'm based on _s by Automattic (https://github.com/automattic/_s). I'm a theme meant for hacking so don't use me as a Parent Theme. Instead try turning me into the next, most awesome, WordPress theme out there. That's what I'm here for.

I include the SASS version of Zurb's Foundation for Sites.

Getting Started
---------------

You'll need:
 - Bower
 - NPM
 - globally installed Gulp `$ npm install --global gulp`

To get started:
1. Clone this repo to your WordPress themes directory.
2. Run `bower install` and `npm install`
3. Adjust the settings file in `assets/scss` to your needs
4. Set your dev domain in `gulpfile.js` for BrowserSync to work
5. Select which Foundation js plugins and utils you wish to use in `gulpfile.js`

To replace the default _s prefixes:
1. Search for `'_s'` (inside single quotations) to capture the text domain.
2. Search for `_s_` to capture all the function names.
3. Search for `Text Domain: _s` in style.css.
4. Search for <code>&nbsp;_s</code> (with a space before it) to capture DocBlocks.
5. Search for `_s-` to capture prefixed handles.

To generate stylesheets and javascript files:
 - run the default gulp task (`$ gulp`) to generate development files. they are not prefixed or minified and contain source maps
 - run `$ gulp build` to generate files used in production. minified, autoprefixed and everyting
 - developmend a production css/js files are loaded based on the `WP_DEBUG` constant defined in `wp-config.php`

Then, update the stylesheet header in `style.css` and the links in `footer.php` with your own information. Next, update or delete this readme.

Now you're ready to go! The next step is easy to say, but harder to do: make an awesome WordPress theme. :)

Good luck!
