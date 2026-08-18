# Instruções para Fazer Push para GitHub

## 🚀 Passos Rápidos para Enviar para GitHub

1. **Abra o PowerShell como Administrador** (use Ctrl+Shift+Esc para abrir o menu Iniciar, busque "PowerShell" e rode como Admin)

2. **Navegue para o diretório do projeto:**
```powershell
cd C:\Users\ESt\Desktop\aguavivaon
```

3. **Inicialize o repositório git:**
```powershell
git init
git config user.name "Estt13"
git config user.email "seu.email@example.com"
```

4. **Adicione todos os arquivos:**
```powershell
git add .
```

5. **Faça o primeiro commit:**
```powershell
git commit -m "Presente para meu mar - Página interativa com água-viva controlável"
```

6. **Crie um repositório no GitHub:**
   - Acesse https://github.com/new
   - Nome do repositório: `presente-para-meu-mar`
   - Descrição: "Um presente interativo com uma água-viva controlável"
   - Clique em "Create repository"

7. **Conecte o repositório local ao GitHub:**
```powershell
git remote add origin https://github.com/Estt13/presente-para-meu-mar.git
git branch -M main
git push -u origin main
```

## ✅ Pronto!

Seu projeto estará agora no GitHub com o nome "presente-para-meu-mar"!

## 📝 Notas

- Se solicitado para autenticar, use seu token de acesso pessoal do GitHub
- Para gerar um token: GitHub → Settings → Developer settings → Personal access tokens
