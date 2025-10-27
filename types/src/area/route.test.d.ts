import './area.component';
import './area-route.component';
declare const TestHome_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
declare class TestHome extends TestHome_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare const TestAbout_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
declare class TestAbout extends TestAbout_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare const TestUser_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
declare class TestUser extends TestUser_base {
    userId?: string;
    render(): import("lit-html").TemplateResult<1>;
}
declare const TestApp_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
declare class TestApp extends TestApp_base {
    render(): import("lit-html").TemplateResult<1>;
}
export { TestApp, TestHome, TestAbout, TestUser };
