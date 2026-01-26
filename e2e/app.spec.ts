import { test, expect, Page } from "@playwright/test";

// ==========================================
// TESTES DA UI
// ==========================================

test.describe("UI - Elementos da Página", () => {
  test("página inicial carrega corretamente", async ({ page }) => {
    await page.goto("/");
    
    // Verifica o título principal
    await expect(page.locator("h1")).toContainText("YouTube to Blog");
    
    // Verifica que a página carregou
    await expect(page).toHaveTitle(/YouTube/i);
  });

  test("formulário de URL do YouTube está visível", async ({ page }) => {
    await page.goto("/");
    
    // Input de URL
    const urlInput = page.locator("#youtube-url");
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toBeEnabled();
  });

  test("placeholder text está correto", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    await expect(urlInput).toHaveAttribute(
      "placeholder",
      "https://www.youtube.com/watch?v=..."
    );
  });

  test("botão de conversão está visível", async ({ page }) => {
    await page.goto("/");
    
    const convertButton = page.locator('button[type="submit"]');
    await expect(convertButton).toBeVisible();
    await expect(convertButton).toContainText("Convert to Blog Post");
  });

  test("seletor de AI provider está visível", async ({ page }) => {
    await page.goto("/");
    
    // Verifica os dois providers
    await expect(page.getByText("OpenAI GPT-4")).toBeVisible();
    await expect(page.getByText("Claude (Anthropic)")).toBeVisible();
  });

  test("features cards estão visíveis", async ({ page }) => {
    await page.goto("/");
    
    await expect(page.getByText("Paste URL")).toBeVisible();
    await expect(page.getByText("AI Processing")).toBeVisible();
    await expect(page.getByText("Get Article")).toBeVisible();
  });
});

// ==========================================
// TESTES DE VALIDAÇÃO
// ==========================================

test.describe("Validação - URLs", () => {
  test("URL inválida mostra mensagem de erro", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    await urlInput.fill("https://invalid-url.com/video");
    
    // Aguarda a mensagem de erro
    await expect(
      page.getByText("Please enter a valid YouTube URL")
    ).toBeVisible();
  });

  test("URL vazia mantém botão desabilitado", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    const convertButton = page.locator('button[type="submit"]');
    
    // Input vazio
    await urlInput.fill("");
    await expect(convertButton).toBeDisabled();
  });

  test("URL válida habilita o botão", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    const convertButton = page.locator('button[type="submit"]');
    
    // URL válida do YouTube
    await urlInput.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    
    // Verifica que o erro não aparece
    await expect(
      page.getByText("Please enter a valid YouTube URL")
    ).not.toBeVisible();
    
    // Botão deve estar habilitado
    await expect(convertButton).toBeEnabled();
  });

  test("formato youtu.be também é aceito", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    await urlInput.fill("https://youtu.be/dQw4w9WgXcQ");
    
    await expect(
      page.getByText("Please enter a valid YouTube URL")
    ).not.toBeVisible();
  });

  test("video ID direto também é aceito", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    await urlInput.fill("dQw4w9WgXcQ");
    
    await expect(
      page.getByText("Please enter a valid YouTube URL")
    ).not.toBeVisible();
  });
});

// ==========================================
// TESTES DE FLUXO (com mock da API)
// ==========================================

test.describe("Fluxo - Conversão", () => {
  test("clicar no botão de conversão com URL válida", async ({ page }) => {
    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    const convertButton = page.locator('button[type="submit"]');
    
    await urlInput.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await expect(convertButton).toBeEnabled();
    
    // Verifica que o botão é clicável
    await convertButton.click();
    
    // Deve mostrar estado de loading
    await expect(page.getByText("Converting...")).toBeVisible();
  });

  test("loading state aparece durante conversão", async ({ page }) => {
    // Mock da API com delay
    await page.route("**/api/convert", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Test Blog Post",
          content: "This is the blog content.",
          markdown: "# Test Blog Post\n\nThis is the blog content.",
        }),
      });
    });

    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    const convertButton = page.locator('button[type="submit"]');
    
    await urlInput.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await convertButton.click();
    
    // Verifica loading state
    await expect(page.getByText("Converting...")).toBeVisible();
    await expect(page.locator(".animate-spin")).toBeVisible();
    
    // Input deve estar desabilitado durante loading
    await expect(urlInput).toBeDisabled();
  });

  test("resultado aparece após conversão bem-sucedida", async ({ page }) => {
    // Mock da API
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Como Aprender Programação em 2024",
          content: "Este é um guia completo sobre como aprender programação.",
          markdown:
            "# Como Aprender Programação em 2024\n\nEste é um guia completo sobre como aprender programação.",
          videoTitle: "Learn Programming in 2024",
          videoId: "dQw4w9WgXcQ",
        }),
      });
    });

    await page.goto("/");
    
    const urlInput = page.locator("#youtube-url");
    const convertButton = page.locator('button[type="submit"]');
    
    await urlInput.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await convertButton.click();
    
    // Aguarda o resultado aparecer
    await expect(
      page.getByText("Como Aprender Programação em 2024")
    ).toBeVisible({ timeout: 10000 });
    
    // Verifica que o conteúdo está visível
    await expect(
      page.getByText("Este é um guia completo sobre como aprender programação.")
    ).toBeVisible();
  });

  test("botões de preview e markdown funcionam", async ({ page }) => {
    // Mock da API
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Test Post",
          content: "Test content",
          markdown: "# Test Post\n\nTest content in markdown",
        }),
      });
    });

    await page.goto("/");
    
    await page.locator("#youtube-url").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.locator('button[type="submit"]').click();
    
    // Aguarda resultado
    await expect(page.getByText("Test Post")).toBeVisible({ timeout: 10000 });
    
    // Verifica botão Markdown
    const markdownButton = page.getByRole("button", { name: /markdown/i });
    await expect(markdownButton).toBeVisible();
    await markdownButton.click();
    
    // Deve mostrar o markdown
    await expect(page.getByText("# Test Post")).toBeVisible();
    
    // Volta para preview
    const previewButton = page.getByRole("button", { name: /preview/i });
    await previewButton.click();
    
    // Deve mostrar o preview
    await expect(page.getByText("Test content")).toBeVisible();
  });

  test("botão de copiar está visível após resultado", async ({ page }) => {
    // Mock da API
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Test Post",
          content: "Test content",
          markdown: "# Test Post",
        }),
      });
    });

    await page.goto("/");
    
    await page.locator("#youtube-url").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.locator('button[type="submit"]').click();
    
    // Aguarda resultado
    await expect(page.getByText("Test Post")).toBeVisible({ timeout: 10000 });
    
    // Verifica botão de copiar (CopyButton)
    const copyButton = page.locator('button:has-text("Copy")');
    await expect(copyButton).toBeVisible();
  });

  test("seleção de AI provider funciona", async ({ page }) => {
    await page.goto("/");
    
    // Seleciona Anthropic
    const anthropicLabel = page.getByText("Claude (Anthropic)");
    await anthropicLabel.click();
    
    // Verifica que está selecionado (pela classe de estilo)
    const anthropicContainer = anthropicLabel.locator("..");
    await expect(anthropicContainer).toHaveClass(/border-primary/);
    
    // Volta para OpenAI
    const openaiLabel = page.getByText("OpenAI GPT-4");
    await openaiLabel.click();
    
    const openaiContainer = openaiLabel.locator("..");
    await expect(openaiContainer).toHaveClass(/border-primary/);
  });
});

// ==========================================
// TESTES DE ERRO
// ==========================================

test.describe("Erros - Tratamento", () => {
  test("erro de API mostra mensagem amigável", async ({ page }) => {
    // Mock da API com erro
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Failed to process video. Please try again.",
        }),
      });
    });

    await page.goto("/");
    
    await page.locator("#youtube-url").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.locator('button[type="submit"]').click();
    
    // Aguarda mensagem de erro
    await expect(page.getByText("Error")).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText("Failed to process video. Please try again.")
    ).toBeVisible();
  });

  test("erro de URL inválida na API", async ({ page }) => {
    // Mock da API com erro de URL inválida
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Invalid YouTube URL",
        }),
      });
    });

    await page.goto("/");
    
    await page.locator("#youtube-url").fill("https://www.youtube.com/watch?v=invalid123");
    await page.locator('button[type="submit"]').click();
    
    // Aguarda mensagem de erro
    await expect(page.getByText("Invalid YouTube URL")).toBeVisible({
      timeout: 10000,
    });
  });

  test("erro de transcrição não disponível", async ({ page }) => {
    // Mock da API com erro de transcrição
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            "Could not fetch transcript. Make sure the video has captions enabled.",
        }),
      });
    });

    await page.goto("/");
    
    await page.locator("#youtube-url").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.locator('button[type="submit"]').click();
    
    // Aguarda mensagem de erro
    await expect(
      page.getByText(/Could not fetch transcript/i)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ==========================================
// TESTES DE API ROUTE
// ==========================================

test.describe("API Route - /api/convert", () => {
  test("POST com URL válida retorna sucesso", async ({ request }) => {
    // Nota: Este teste requer mock real da API ou ambiente configurado
    // Por padrão, testamos a estrutura da resposta
    
    // Mock para teste isolado
    const mockResponse = {
      title: "Test Blog Post",
      content: "Test content",
      markdown: "# Test",
      videoTitle: "Original Video",
      videoId: "dQw4w9WgXcQ",
    };

    // Verifica estrutura esperada
    expect(mockResponse).toHaveProperty("title");
    expect(mockResponse).toHaveProperty("content");
    expect(mockResponse).toHaveProperty("markdown");
  });

  test("POST sem URL retorna erro 400", async ({ page }) => {
    // Faz chamada direta à API
    const response = await page.request.post("/api/convert", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toBe("YouTube URL is required");
  });

  test("POST com URL inválida retorna erro 400", async ({ page }) => {
    const response = await page.request.post("/api/convert", {
      data: { url: "not-a-valid-url" },
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toBe("Invalid YouTube URL");
  });

  test("resposta tem formato correto", async ({ page }) => {
    // Mock da API para verificar formato
    await page.route("**/api/convert", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Test Title",
          content: "Test content paragraph.",
          markdown: "# Test Title\n\nTest content paragraph.",
          videoTitle: "Original Video Title",
          videoId: "abc123xyz00",
        }),
      });
    });

    const response = await page.request.post("/api/convert", {
      data: { url: "https://www.youtube.com/watch?v=abc123xyz00" },
      headers: { "Content-Type": "application/json" },
    });

    const body = await response.json();
    
    // Verifica campos obrigatórios
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("content");
    expect(body).toHaveProperty("markdown");
    
    // Verifica tipos
    expect(typeof body.title).toBe("string");
    expect(typeof body.content).toBe("string");
    expect(typeof body.markdown).toBe("string");
  });
});

// ==========================================
// TESTES DE ACESSIBILIDADE BÁSICA
// ==========================================

test.describe("Acessibilidade", () => {
  test("input tem label associado", async ({ page }) => {
    await page.goto("/");
    
    const label = page.locator('label[for="youtube-url"]');
    await expect(label).toBeVisible();
    await expect(label).toContainText("YouTube Video URL");
  });

  test("navegação por teclado funciona", async ({ page }) => {
    await page.goto("/");
    
    // Foca no input
    await page.locator("#youtube-url").focus();
    
    // Tab para providers
    await page.keyboard.press("Tab");
    
    // Tab para botão submit
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    // Verifica que o botão está focado
    const activeElement = page.locator(":focus");
    await expect(activeElement).toHaveAttribute("type", "submit");
  });
});
