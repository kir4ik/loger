# Истрункция по установке

#### Перейти в папку проектом и выполнить следующие команды

> **cd client && yarn install && yarn build**

> **cd - && yarn install**

#### Для запуска сервера выполнить

> **yarn server**

после этого окрыть страницу по url: _http://localhost:3000_
статические файлы будут доступны по пути начинающемуся с **_/assets/_**

## Описание работы приложения

- при открытии страницы, клиент-сокет автоматически подключается к серверу
- начинает слать по рандомным событиям приготовленные данные
- интервал между запроами 2 секунды, если происходит сбой, тогда запрос, который дал сбой, будет пытвться выполниться с интервалом в 1 секунду
- после того как запрос был выполнен успешно - отсылается новый рандомный запрос
- клиет может выбрать изображение
- как толко изображение было выбрано, сервер его скачивает в папку **_client/assets/img_** - доступна по url **_/assets/img_**

> - Сервер логирует каждый успешный запрос

Логи должны находится в корне проекта, файл **test.log**
