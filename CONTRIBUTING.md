# Flujo de trabajo con Git y GitHub

Este proyecto utiliza `development` como rama principal de desarrollo.

Cada funcionalidad, cambio o corrección debe trabajarse en una **rama propia** y luego integrarse mediante un **Pull Request (PR)** hacia `development`.

---

## 1. Clonar el repositorio

La primera vez que trabajes en el proyecto, clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entra a la carpeta:

```bash
cd <NOMBRE_DEL_REPOSITORIO>
```

---

## 2. Ir a `development`

Antes de comenzar cualquier trabajo, asegúrate de estar en `development`:

```bash
git switch development
```

Actualiza tu copia local:

```bash
git pull origin development
```

> **Importante:** siempre crea tu rama nueva a partir de una versión actualizada de `development`.

---

## 3. Crear una rama para tu trabajo

Nunca trabajes directamente sobre `development`.

Crea una rama nueva:

```bash
git switch -c nombre-de-tu-rama
```

Por ejemplo:

```bash
git switch -c feature/password-recovery
```

Para una corrección:

```bash
git switch -c fix/recovery-code
```

Algunos ejemplos de nombres:

```text
feature/login
feature/password-recovery
feature/create-delivery
fix/login-validation
fix/recovery-code
```

---

## 4. Trabajar y hacer commits

Realiza los cambios necesarios en tu rama.

Puedes comprobar qué modificaste con:

```bash
git status
```

Agrega los cambios:

```bash
git add .
```

Haz un commit:

```bash
git commit -m "Add password recovery"
```

Los commits deben describir claramente qué se hizo.

Ejemplos:

```text
Add login endpoint
Add password recovery
Fix recovery code validation
Add user repository
Update delivery validation
```

---

## 5. Ejecutar los tests

Antes de subir los cambios, ejecuta los tests localmente.

Por ejemplo:

```bash
./mvnw test
```

Si los tests fallan, **corrige los errores antes de crear el Pull Request**.

No subas código sabiendo que los tests están fallando.

---

## 6. Subir la rama a GitHub

Cuando el código esté listo:

```bash
git push -u origin nombre-de-tu-rama
```

Por ejemplo:

```bash
git push -u origin feature/password-recovery
```

---

## 7. Crear el Pull Request

Entra al repositorio en GitHub.

GitHub normalmente mostrará una opción para crear un Pull Request con la rama que acabas de subir.

El Pull Request debe ser:

```text
nombre-de-tu-rama → development
```

**Nunca hagas el Pull Request directamente hacia `main`**, a menos que el equipo lo acuerde explícitamente.

---

## 8. Esperar los checks

Al crear el Pull Request, GitHub ejecutará los checks configurados para el proyecto.

Entre ellos estarán los tests.

Por ejemplo:

```text
✓ Build
✓ Tests
✓ Checks
```

### Si los checks pasan

Puedes continuar con el proceso de merge.

### Si los checks fallan

**No hagas merge.**

Revisa qué falló, corrige el problema en tu rama y vuelve a hacer push:

```bash
git add .
git commit -m "Fix failing tests"
git push
```

El Pull Request se actualizará automáticamente y GitHub volverá a ejecutar los checks.

---

## 9. Hacer merge

Cuando:

- El código esté terminado.
- Los tests pasen.
- Los checks estén correctos.
- El Pull Request esté listo para ser integrado.

Se hace el **merge del Pull Request hacia `development`**.

Después del merge, esa funcionalidad ya forma parte de `development`.

---

# MUY IMPORTANTE: una rama usada no se reutiliza

Una vez que un Pull Request haya sido **mergeado**, esa rama se considera terminada.

### NO hagas esto

```text
feature/login
    ↓
Pull Request
    ↓
development
    ↓
MERGE

feature/login ← NO reutilizar
```

Si después necesitas hacer otro cambio relacionado con login, **no vuelvas a trabajar en `feature/login`**.

Debes crear una rama nueva desde `development`:

```bash
git switch development
git pull origin development
git switch -c fix/login-validation
```

Esto mantiene cada cambio separado y evita problemas con Pull Requests antiguos.

---

# Flujo completo

En resumen, cada funcionalidad sigue este flujo:

```text
                    development
                         │
                         │ git pull
                         ▼
                  Crear nueva rama
                         │
                         ▼
                  Trabajar / programar
                         │
                         ▼
                     git commit
                         │
                         ▼
                      git push
                         │
                         ▼
                   Pull Request
                         │
                         ▼
                    GitHub Checks
                    /           \
                 FALLA          PASA
                   │              │
                   ▼              ▼
                Corregir        MERGE
                   │              │
                   └─── push ─────┘
                                  │
                                  ▼
                             development
                                  │
                                  ▼
                         Rama terminada
                         NO reutilizar
```

---

# Comandos básicos

### Empezar una nueva funcionalidad

```bash
git switch development
git pull origin development
git switch -c feature/nombre-de-la-funcionalidad
```

### Guardar cambios

```bash
git add .
git commit -m "Describe el cambio"
```

### Subir cambios

```bash
git push -u origin feature/nombre-de-la-funcionalidad
```

### Después de que el PR sea mergeado

Para una nueva funcionalidad o corrección:

```bash
git switch development
git pull origin development
git switch -c feature/nueva-funcionalidad
```

---

## Regla principal

> **Una funcionalidad = una rama = un Pull Request.**
>
> Después de hacer merge, **la rama se termina y no se reutiliza**.
