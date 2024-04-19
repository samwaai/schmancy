import { $LitElement } from "@mhmo91/lit-mixins/src";
import { consume } from "@lit/context";
import { SchmancyInputChangeEvent } from "@mhmo91/schmancy";
import { $notify } from "@mhmo91/schmancy";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { LoginCredentials, LoginCredentialsContext } from "./login.context";
import store from "src/store/store";
import { upsertUser } from "src/store/slices/user/user.slice";
import supabase from "@db/supabase";

@customElement("supabase-login-otp")
export default class SupabaseLoginOTP extends $LitElement() {
  @consume({ context: LoginCredentialsContext })
  @state()
  public loginCredentials?: LoginCredentials;

  @state()
  busy = false;
  @state()
  otp = "";
  async getOTP() {
    this.busy = true;
    const { data, error } = await supabase.auth.verifyOtp({
      email: this.loginCredentials?.email as string,
      token: this.loginCredentials?.otp as string,
      type: "magiclink",
    });
    this.busy = false;
    if (error) {
      $notify.error(error.message);
      return;
    } else {
      store.dispatch(
        upsertUser({
          ...data.user,
          access_token: data.session?.access_token,
          expires_at: data.session?.expires_at,
          expires_in: data.session?.expires_in,
        })
      );
      this.dispatchEvent(
        new CustomEvent("login-success", { bubbles: true, composed: true })
      );
    }
  }
  protected render(): unknown {
    return html` <schmancy-form class="space-y-6" @submit=${this.getOTP}>
      <schmancy-grid gap="md" align="stretch">
        <schmancy-typography>
          <schmancy-animated-text
            .translateY=${["1.1em", 0]}
            .translateZ=${[0, 0]}
            stagger="25"
            duration="500"
          >
            Check your email for the one time password
          </schmancy-animated-text>
        </schmancy-typography>
        <schmancy-input
          id="otp"
          name="otp"
          type="number"
          autocomplete="otp"
          required
          @change=${(e: SchmancyInputChangeEvent) => {
            this.loginCredentials!.otp = e.detail.value;
          }}
        >
        </schmancy-input>

        <schmancy-button
          .disabled=${this.busy}
          variant="filled"
          type="submit"
          width="full"
        >
          ${when(
            this.busy,
            () => html`on it...`,
            () => html`Sign in`
          )}
        </schmancy-button>
      </schmancy-grid>
    </schmancy-form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "supabase-login-otp": SupabaseLoginOTP;
  }
}
