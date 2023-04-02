<script>
  import { onMount } from "svelte";

  // import Button from './Button.svelte'

  const Label = {
    form: "authentication-form",
    title: "authentication-title",
    tabMail: "authentication-tab-mail",
    tabPhone: "authentication-tab-phone",
    inputMail: "authentication-input-mail",
    inputPhone: "authentication-input-phone",
    submit: "authentication-submit",
    inputNumber: "authentication-input-number",
    phoneCountry: "authentication-phone-country",
    resendCode: "authentication-resend-code",
    registration: "authentication-registration",
    phoneInputCountrySearch: "authentication-phone-input-country-search",
    phoneCountryOption: "authentication-phone-country-option",
  };

  export let allowMail;
  export let allowPhone;
  export let initialCountryCode;
  export let props;

  function mitosis_styling(node, vars) {
    Object.entries(vars || {}).forEach(([p, v]) => {
      if (p.startsWith("--")) {
        node.style.setProperty(p, v);
      } else {
        node.style[p] = v;
      }
    });
  }

  let tab = allowMail ? "mail" : "phone";
  let mailTabOpen = allowMail ?? true;
  let phoneTabOpen = !(allowMail ?? true) && (allowPhone ?? true);
  let mail = "";
  let phone = "";
  let countryCode = initialCountryCode || "ch";
  let mailValid = true;
  let phoneValid = true;
  let loading = false;
  let registration = false;
  let error = "";
  let codeValid = true;
  let phoneTabClass = "active";
  let mailTabClass = "";
  // Set initial props.
  allowMail ??= true;
  allowPhone ??= true;

  onMount(() => {
    console.log(mailTabOpen, phoneTabOpen);
  });
</script>

<form
  use:mitosis_styling={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}
  aria-label={Label.form}
>
  <div
    use:mitosis_styling={{
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
    }}
  >
    {#if allowMail}
      <button
        use:mitosis_styling={{
          cursor: "pointer",
          color: "black",
          background: "none",
          border: "none",
          outline: "none",
          padding: "0px",
          fontSize: "16px",
          fontFamily: "inherit",
        }}
        type="button"
        aria-label={Label.tabMail}
        on:click={(event) => {
          tab = "mail";
          mailTabOpen = true;
          phoneTabOpen = false;
        }}
      >
        Mail
      </button>
    {/if}

    {#if allowPhone}
      <button
        use:mitosis_styling={{
          cursor: "pointer",
          color: "black",
          background: "none",
          border: "none",
          outline: "none",
          padding: "0px",
          fontSize: "16px",
          fontFamily: "inherit",
        }}
        type="button"
        aria-label={Label.tabPhone}
        on:click={(event) => {
          tab = "phone";
          mailTabOpen = false;
          phoneTabOpen = true;
        }}
      >
        Phone
      </button>
    {/if}
  </div>

  {#if mailTabOpen}
    <input
      use:mitosis_styling={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
        padding: "9px",
        outline: "none",
        borderRadius: "0px",
        fontSize: "16px",
        fontFamily: "inherit",
        backgroundColor: "inherit",
      }}
      placeholder="Mail"
      type="email"
      aria-label={Label.inputMail}
      aria-invalid={false}
      bind:value={mail}
    />
  {/if}

  {#if phoneTabOpen}
    <input
      use:mitosis_styling={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
        padding: "9px",
        outline: "none",
        borderRadius: "0px",
        fontSize: "16px",
        fontFamily: "inherit",
        backgroundColor: "inherit",
      }}
      placeholder="Phone"
      type="tel"
      aria-label={Label.inputPhone}
      aria-invalid={false}
      bind:value={phone}
    />
  {/if}
  <button
    use:mitosis_styling={{
      backgroundColor: "black",
      border: "none",
      color: "white",
      padding: "10px",
      cursor: "pointer",
      borderRadius: "0px",
      fontSize: "16px",
      fontFamily: "inherit",
    }}
    type="submit"
    aria-label={Label.submit}
  >
    Submit
  </button>
</form>