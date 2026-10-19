import { test, expect } from '@playwright/test';

/**
 * SauceDemo 页面引用了 Google Fonts 的第三方样式表（fonts.googleapis.com）。
 * 该域名在当前网络环境下会偶发挂起约 30 秒才超时，期间页面会被卡死，
 * 导致 page.goto 迟迟不返回、测试撞上默认的 30 秒超时。
 * 字体缺失不影响功能和断言，所以这里直接拦截该请求，保证用例稳定且快速。
 */
test.beforeEach(async ({ page }) => {
  await page.route(
    (url) => /fonts\.(googleapis|gstatic)\.com/.test(url.href),
    (route) => route.abort(),
  );
});

test('标准用户可以登录并看到商品列表', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('inventory-container')).toBeVisible();
});
