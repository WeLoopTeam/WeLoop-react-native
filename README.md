# WeLoop-react-native

## Install

```bash
npm install react-native-weloop --save
```

## Usage

### Import

```js
import Weeloop from "react-native-weloop";
````
### Simple Example

```js
<Weeloop
    appGuid="YOUR_PROJECT_GUID"
/>
```


### Automatic Authentication
In order to invoke WeLoop with an automatic authentication, you need to provide the user identity.

```js
<Weeloop
  appGuid="YOUR_PROJECT_GUID"
  user={{
    email: "YOUR_EMAIL",
    firstname: "YOUR_FIRSTNAME",
    lastname: "YOUR_LASTNAME",
    key: "YOUR_KEY",
  }}
/>
```
### Custom Invocation

To invoke the Weeloop WebView with a custom Button, you need to add props:
```js
<Button
  title="WebView"
  onPress={() => {
    this.weeloop.current.invoke();
  }}
/>
<Weeloop
  ref={this.weeloop}
  custom={false}
  appGuid="YOUR_PROJECT_GUID"
/>
```

## Props

### Weloop props

| Props           | type           | description                                                          | required | default |
| :-------------- | :------------- | :------------------------------------------------------------------- | :------- | :------ |
| appGuid           | String          | Api Key for weloop webview | required | null
| custom           | bool          | enable/disable custom invocation | | false
| user           | Object          | User informations object with email, firstname, lastname and key | | null

## License

WeLoop is available under the MIT license. See the LICENSE file for more info.
