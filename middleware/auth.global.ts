export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  // ✅ bikin whitelist route/layout yang public
  const publicPages = ["thankyou"]; // nama route page
  const publicLayouts = ["customPublic"]; // nama layout

  // kalau masuk whitelist → skip auth
  if (publicPages.includes(to.name as string)) return;
  if (to.meta.layout && publicLayouts.includes(to.meta.layout as string))
    return;

  // rules auth biasa
  if (user && to.name === "auth-login") {
    return navigateTo("/");
  }
  if (!user && to.name !== "auth-login") {
    return navigateTo("/auth/login");
  }
});
