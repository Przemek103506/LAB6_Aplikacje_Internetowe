# Kontrakt REST API – System Dziekanatu (`/api/v1`)

## 1. Konwencje ogólne (Zadanie 6.1d)

- **Prefiks wersji:** Wszystkie adresy URI rozpoczynają się od `/api/v1`.
- **Format danych:** Komunikacja odbywa się w formacie JSON (`Content-Type: application/json`). Nazwy pól stosują konwencję `camelCase`, a daty zapisywane są w standardzie ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Pojedynczy zasób:** Zwracany bezpośrednio jako obiekt JSON bez dodatkowej otoczki.
- **Kolekcje zasobów:** Zwracane jako obiekt ze stronicowaniem:
  ```json
  {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
  ```
