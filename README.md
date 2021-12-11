# Gadget UserFunctions

Provides functions similar to [Extension:UserFunctions](https://www.mediawiki.org/wiki/Extension:UserFunctions) based on JavaScript.

## Basic usage

```html
* <span class="user-functions" data-username></span>
* <span class="user-functions" data-if-logged-in="{true | false}"></span>
* <span class="user-functions" data-if-username="{string | string[]}"></span>
* <span class="user-functions" data-if-usergroup="{string | string[]}"></span>
```

## Data types

### `boolean`

- **false**: `false` `no` `0` will give `false`
- **true**: any other value will give `true`

_examples_

```html
<!-- true -->
<span class="user-functions" data-if-logged-in>logged in</span>
<span class="user-functions" data-if-logged-in="">logged in</span>
<span class="user-functions" data-if-logged-in="whatever">logged in</span>
<!-- false -->
<span class="user-functions" data-if-logged-in="false">logged in</span>
<span class="user-functions" data-if-logged-in="no">logged in</span>
<span class="user-functions" data-if-logged-in="0">logged in</span>
```

### `string[]`

- String will be split by `|`.
- String starts with `!` means `false`

_example_: `foo|!bar` → `{foo: true, bar: false}`