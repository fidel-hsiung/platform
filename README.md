# README

This is a project management platform built with Rails + React. Admins can create jobs and assign to users. Users can only view jobs. Admins have the permission for jobs CRUD, users CRUD. Users only have the permission for jobs read, and users read, however, they can modify their own profile.

Note! The development key is ignored when upload to Github, you have to generate your own key, and insert the `google_place_key` and `secret_key_base`.


System configurations:

* Ruby version 2.6.0

* Rails version 6.0.2

* React version 16.13.1

* Database PG


Features:

* Login, achieved by gem bcrypt, jwt

* Calendar View

* Job CRU

* USER CRU

* Different permission for admin and other roles


Implementations

* Authentication with bcrypt gem

* JWT for user authentication

* Action cable for auto sync calendar jobs

* fast_jsonapi for API json serializer

* Google Place API for address auto complete

* React big calendar for jobs calendar view

* React redux for global state storage

* React router


To be finished:

* Forgot password feature

* Docker

* Log system to record all users operation history.
