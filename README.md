# 🛒 Libre Mercado, proyecto de prueba técnica

Aplicación de gestión de pedidos e inventario construida con **Next.js, Node.js, Express, SQLite, RabbitMQ y Docker Compose**.

## 🚀 Instalación e inicio

### Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) con Docker Compose.
- [Git](https://git-scm.com/), si vas a clonar el repositorio.

### 1. Clonar el repositorio

En el bash o consola ejecutar o también desde Github Desktop

```bash
git clone https://github.com/CristianCMDev/Prueba-t-cnica
cd Prueba-t-cnica
```

Si ya tienes el proyecto descargado, simplemente abre una terminal en la carpeta raíz.

### 2. Iniciar Docker Desktop

Abre Docker Desktop y espera a que el motor de Docker esté funcionando.

### 3. Construir e iniciar los servicios

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up -d --build
```

Este comando construye las imágenes necesarias e inicia los contenedores en segundo plano.

### 4. Verificar el estado de los servicios

```bash
docker compose ps
```

Este comando lo hacemos para que los servicios estén iniciados.

### 5. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:3000 |
| API de pedidos | http://localhost:3001 |
| API de inventario | http://localhost:3002 |
| Panel de administración de RabbitMQ | http://localhost:15672 |

Para acceder al panel de RabbitMQ en la configuración local de Docker Compose, utiliza las siguientes credenciales:

      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: local_dev_password

## 🏗️ Como esta hecho

El sistema está compuesto por los siguientes servicios:

| Servicio | Responsabilidad |
|---|---|
| **Frontend** | Interfaz web para consultar productos y crear pedidos. |
| **Backend de pedidos** | Recibe los pedidos, los registra y publica eventos en RabbitMQ. |
| **API de inventario** | Expone los endpoints para consultar productos y existencias. |
| **Consumidor de inventario** | Procesa los eventos de pedidos y reserva las existencias disponibles. |
| **Consumidor de resultados** | Recibe el resultado de la reserva y actualiza el estado del pedido. |
| **RabbitMQ** | Gestiona la comunicación asíncrona mediante colas de mensajes. |
| **SQLite** | Almacena los pedidos y el inventario en bases de datos independientes. |

## Eleccion de tecnologías

Para este proyecto, teniendo en cuenta las tecnologías disponibles, quise utilizar React para el frontend, pero vi que estaba deprecado, así que opté por Next.js, que actualmente es una opción estándar para desarrollar aplicaciones con React.

Decidí escoger SQLite porque es muy ligero y fácil de manejar dentro del proyecto, además de que es suficiente para lo que necesitamos.

- **Frontend:** Next.js, React y Tailwind CSS.
- **Backend:** Node.js y Express.
- **Mensajería:** RabbitMQ.
- **Bases de datos:** SQLite y `better-sqlite3`.
- **Contenedores:** Docker y Docker Compose.

## Como funciona

1. El usuario selecciona un producto e indica el nombre del cliente y la cantidad.
2. El frontend envía el pedido al backend.
3. El backend valida la solicitud, registra el pedido y publica un evento orders.created.
4. El consumidor de inventario recibe el evento y verifica la disponibilidad del producto.
5. Si hay existencias suficientes, las reserva y publica un evento stock.reserved. De lo contrario, publica stock.rejected.
6. El consumidor de resultados recibe el evento y actualiza el estado del pedido.


## Nota

- Aunque hubo algunos detalles que no alcancé a implementar y ciertos errores me tomaron más tiempo del esperado, disfruté mucho desarrollando este proyecto. Fue una buena oportunidad para aprender, resolver problemas y poner en práctica mis conocimientos. Al final, logré sacar adelante la implementación y dejar funcionando los servicios mediante Docker Compose.
