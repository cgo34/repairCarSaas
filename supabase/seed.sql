--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: body_materials; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.body_materials (id, name, code) VALUES ('bfce0152-5f97-4f5f-9866-a76df1644801', 'Aluminium', 'aluminium');
INSERT INTO public.body_materials (id, name, code) VALUES ('e3f173e6-80c8-4167-8181-4650f81a11e6', 'Tôle', 'tole');


--
-- Data for Name: body_parts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.body_parts (id, name, code, color) VALUES ('92ae2adf-3941-4f4d-8154-379d6891327a', 'Aile avant gauche', 'aile-avant-gauche', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('6571283b-738a-459d-8b44-3eaf04632206', 'Capot', 'capot', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('61ce2e3c-2319-49f6-811e-182904078f82', 'Aile avant droite', 'aile-avant-droite', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('78c36af6-1ecb-4812-9128-e44d409a79f9', 'Toit', 'toit', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('06140b77-9efa-4092-9a7a-c7314e10e361', 'Coffre', 'coffre', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('9d49c052-4996-408f-adde-2903e1aefc14', 'Aile arrière gauche', 'aile-arriere-gauche', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('1d0bf49f-989a-4fe7-8f3e-2df934d4598c', 'Aile arrière droite', 'aile-arriere-droite', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('02f322c2-7a67-4266-8492-dbfc6d9927b5', 'Porte arrière gauche', 'porte-arriere-gauche', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('94375e1b-f526-49ad-886a-e0e43d276430', 'Porte arrière droite', 'porte-arriere-droite', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('bc666005-98fd-4353-a358-b85394e6d60d', 'Porte avant gauche', 'porte-avant-gauche', '');
INSERT INTO public.body_parts (id, name, code, color) VALUES ('21fb3b8d-aa0b-4a34-8ade-03951518df30', 'Porte avant droite', 'porte-avant-droite', '');


--
-- Data for Name: default_setting_price_body_part_coefficient; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('6a84d5e2-a300-4b0c-b253-05c0e75a31b9', '02f322c2-7a67-4266-8492-dbfc6d9927b5', 1.30, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('735ad77f-fd1f-4e46-85ce-3205a6b87acf', '06140b77-9efa-4092-9a7a-c7314e10e361', 1.30, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('c12d08ba-d830-40f7-bef4-46397db0df8f', '1d0bf49f-989a-4fe7-8f3e-2df934d4598c', 1.30, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('dce883f0-78dc-4789-b581-86a070879841', '21fb3b8d-aa0b-4a34-8ade-03951518df30', 1.25, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('84095a92-5a01-46e4-b7a4-b6a34459c6e7', '61ce2e3c-2319-49f6-811e-182904078f82', 1.25, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('1362006b-02f3-4b31-9d2e-13417907c866', '6571283b-738a-459d-8b44-3eaf04632206', 1.06, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('7fc70f7a-a20b-413c-9e6f-188382df24e2', '78c36af6-1ecb-4812-9128-e44d409a79f9', 1.20, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('36527746-904d-4c92-80dd-99940a6187a0', '92ae2adf-3941-4f4d-8154-379d6891327a', 1.25, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('3fa61dde-d7e0-45c0-84e1-476fbb49cb74', '94375e1b-f526-49ad-886a-e0e43d276430', 1.30, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('9b361ae2-7a39-4461-ae18-b2589f511bcf', '9d49c052-4996-408f-adde-2903e1aefc14', 1.30, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');
INSERT INTO public.default_setting_price_body_part_coefficient (id, body_part_id, difficulty_coefficient, created_at, updated_at) VALUES ('4ad39012-ba21-4e50-a319-90ef2aefa91e', 'bc666005-98fd-4353-a358-b85394e6d60d', 1.25, '2026-04-30 17:12:50.694902+00', '2026-04-30 17:12:50.694902+00');


--
-- Data for Name: default_setting_price_diameter_coefficient; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.default_setting_price_diameter_coefficient (id, diameter, coefficient, created_at, updated_at) VALUES ('cdf04bb4-d582-4de7-8a5d-7546b9e07073', 25.00, 1.00, '2026-04-30 17:04:52.702589+00', '2026-04-30 17:04:52.702589+00');
INSERT INTO public.default_setting_price_diameter_coefficient (id, diameter, coefficient, created_at, updated_at) VALUES ('9947c20c-3754-4472-a2a9-c6820083eca0', 35.00, 1.00, '2026-04-30 17:05:02.283004+00', '2026-04-30 17:05:02.283004+00');


--
-- Data for Name: default_setting_price_general; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.default_setting_price_general (id, hourly_rate, unit_time, created_at, updated_at) VALUES ('5437cdd5-7479-487e-a4a2-85116d97c796', 180.00, 6, '2026-04-30 17:04:30.480908+00', '2026-04-30 17:04:30.480908+00');


--
-- Data for Name: default_setting_price_impact_count_to_ut; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('67e6e4c9-b610-4c51-a83c-9ff383bca6a5', 1, 1, 1, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('dcc62fef-0184-46af-bbbf-fb461029901a', 2, 2, 2, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('4628075c-bf14-4443-a284-6ee22942c4b4', 3, 3, 4, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('a2fdf513-8bf4-4680-96b5-6547fc417a7f', 4, 4, 4, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('2f8fcd5a-ccbb-47d4-9bbb-be157188aaf3', 5, 5, 4, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('428d3e0f-620a-47a5-aac7-4cad341dc684', 6, 6, 6, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('5403601d-96a9-4349-8177-a7a07d2b4564', 7, 7, 6, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('93e1c8c6-9ffd-4141-ade4-21c3298ff5f1', 8, 8, 6, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('330b3453-1c58-473a-9f00-6e25b7bf75cb', 9, 9, 6, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('0d98a5aa-3ba2-4d31-8572-a12a7ade5ddc', 10, 10, 6, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('a0cf7401-ae7b-4f13-8cdf-b9ef1fd9c685', 11, 15, 8, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('342ba582-645a-4a87-b96a-f6ea73ee2b8d', 16, 20, 9, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('f434b7df-336a-4b18-9b6d-8bf1d52fdccd', 21, 25, 11, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('13093c8d-8f5e-40b4-9ece-5b0859e6ef8d', 26, 30, 13, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('252a6440-1436-4408-9073-f5f6da376ffa', 31, 40, 17, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('644bc277-d3b2-43fd-8be0-47f751d94743', 41, 50, 18, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('bdd6b3ff-28c5-4927-8ace-f91c235c7c13', 51, 75, 21, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('85235c3b-6200-4b8c-9bd8-636c47168c96', 75, 100, 29, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('d07fcdce-29a2-4f44-ad3d-abf38d421793', 101, 150, 31, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('6b610061-8209-48e4-ad71-f75c69fc4758', 151, 200, 44, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('bfe0a679-1198-4ce5-9037-72f50677dba3', 201, 250, 47, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('37e60aeb-d621-4e9b-83c0-c45ab77f3cc2', 251, 300, 56, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('9c500399-a38d-4197-b18d-8fcd46cd18eb', 301, 350, 65, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('6c111b14-3cba-40b6-9423-61af316a5d61', 350, 400, 70, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('7c0eae2b-7009-4c62-bf7e-78193e06f0b5', 401, 450, 83, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('2218f406-97cf-41f3-afaa-c28d2f3eaec6', 501, 550, 83, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');
INSERT INTO public.default_setting_price_impact_count_to_ut (id, impact_count_min, impact_count_max, unit_time, created_at, updated_at) VALUES ('d82ffd77-713b-4d4d-9d69-663ba6c9ac1f', 551, 600, 92, '2026-04-30 17:14:29.983669+00', '2026-04-30 17:14:29.983669+00');


--
-- Data for Name: default_setting_price_technicity_coefficient; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.default_setting_price_technicity_coefficient (id, aluminium_coefficient, dsp_coefficient, dap_coefficient, created_at, updated_at) VALUES ('e18d87a3-171c-4294-ade5-56b68277e53c', 1.35, 1.00, 0.75, '2026-04-30 17:05:50.650135+00', '2026-04-30 17:05:50.650135+00');


--
-- Data for Name: document_statuses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.document_statuses (id, code, label) VALUES ('16f95f88-aa23-4666-a64a-6354f93b190e', 'accepted', 'Accepted');
INSERT INTO public.document_statuses (id, code, label) VALUES ('1aa1bc54-277e-4b5a-bd1d-fad8fa5e3918', 'refused', 'Refused');
INSERT INTO public.document_statuses (id, code, label) VALUES ('e1a524e8-09c5-4c4c-9dae-d469f92df00a', 'cancelled', 'Cancelled');
INSERT INTO public.document_statuses (id, code, label) VALUES ('320cf038-3c0d-4d13-8c06-b5bb491bed53', 'invoiced', 'Invoiced');
INSERT INTO public.document_statuses (id, code, label) VALUES ('659ea8e5-8b84-403e-9f8c-a7441ea12b3a', 'paid', 'Paid');
INSERT INTO public.document_statuses (id, code, label) VALUES ('0d32be18-c364-4489-ad10-02f50cd85efb', 'pending', 'Pending');
INSERT INTO public.document_statuses (id, code, label) VALUES ('c950f32f-8d72-4271-aefa-b7ee7897f6fd', 'draft', 'Draft');


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('max_seats', 'limit', 'Sièges', 'Nombre de membres (admin, manager, technicien)', true, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('max_garages', 'limit', 'Garages', 'Nombre de garages enregistrés', false, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('max_quotes_per_month', 'limit', 'Devis / mois', 'Devis créés par mois calendaire', false, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('max_invoices_per_month', 'limit', 'Factures / mois', 'Factures créées par mois calendaire', false, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('car_view', 'boolean', 'Vue voiture', 'Vue voiture dans l''édition des devis et factures', true, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('quote_to_invoice', 'boolean', 'Conversion en facture', 'Convertir un devis en facture', false, NULL, '2026-11-25 21:44:21.129043+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('max_conversions_per_month', 'limit', 'Conversions devis → facture / mois', 'Devis convertis en facture par mois calendaire', false, NULL, '2026-11-27 16:51:20.663892+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('invoice_email_sending', 'boolean', 'Envoi des factures par email', 'Envoyer les factures par email depuis l''application', true, NULL, '2026-11-27 17:11:34.710718+00');
INSERT INTO public.features (key, type, name, description, is_addon, stripe_price_id, created_at) VALUES ('quote_email_sending', 'boolean', 'Envoi des devis par email', 'Envoyer les devis par email depuis l''application', true, NULL, '2026-11-25 21:44:21.129043+00');


--
-- Data for Name: hail_departments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('372ddf11-d532-4fbf-9ccd-c9407efdaa3f', '01', 'Ain', 46.1100, 5.3600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('0faa652b-3a06-45c4-bde1-2ebfe4d66817', '02', 'Aisne', 49.5700, 3.6200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('e11bf7ac-4332-4d9c-8636-6191cb57de5d', '03', 'Allier', 46.3500, 3.3100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('df76e40e-ab22-445b-8e82-af19bd64f0ef', '04', 'Alpes-de-Haute-Provence', 44.0600, 6.2300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('bb34bc62-0b7a-4d76-a8b2-272b4d0b8745', '05', 'Hautes-Alpes', 44.6500, 6.3500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('e863fe7a-2c5d-4d35-9f92-5ba660e3d4b2', '06', 'Alpes-Maritimes', 43.9200, 7.1900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f5197b01-e9f9-4352-ad1b-8a0f4d29f0bf', '07', 'Ardèche', 44.7500, 4.3500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('e1e373d0-c11f-488b-89d5-fa660b3ddd38', '08', 'Ardennes', 49.6900, 4.6700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('48e5bb8c-6289-4813-9d38-90e2f6c01131', '09', 'Ariège', 42.9300, 1.5500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('6d456186-00d3-41f7-9274-c1cdbf01544e', '10', 'Aube', 48.3000, 4.0700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('c0b64369-5b0b-44e8-bc81-83ce95065885', '11', 'Aude', 43.1700, 2.3500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('dc2e4ce4-aa4f-404f-91bf-21e17af9658c', '12', 'Aveyron', 44.2800, 2.5700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d6f1647b-1a06-4737-9163-76df29312abb', '13', 'Bouches-du-Rhône', 43.5500, 5.3600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('96ab8fe0-01dc-4927-aa25-b78a5d5199ad', '14', 'Calvados', 49.0900, -0.3600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('51f874a2-f8da-49d9-90d1-4fc6ca637652', '15', 'Cantal', 45.0700, 2.6800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('7edd67b5-16be-4cd8-acca-ad509d1c37a4', '16', 'Charente', 45.6500, 0.1600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('55c08dec-8ab3-4269-9a89-f8529e82c0d7', '17', 'Charente-Maritime', 45.7500, -0.6700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f07c2a10-ba31-46cc-98fb-c160cd16f6cd', '18', 'Cher', 47.0700, 2.4300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('c0d08b84-e2d8-4d36-8585-f37febcd193f', '19', 'Corrèze', 45.3500, 1.8900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b5f38c3c-a70f-4ec3-b322-30e0f7973161', '2A', 'Corse-du-Sud', 41.8600, 9.0100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f8f3a42a-746a-4335-8373-e0843658e33b', '2B', 'Haute-Corse', 42.3900, 9.2100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('faf79ff7-1841-49c2-9ea3-5c1c97aaaafe', '21', 'Côte-d''Or', 47.4000, 4.7700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('43f12a6f-41b6-460d-8cb3-3abb90fca8b6', '22', 'Côtes-d''Armor', 48.4600, -2.9500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5061112a-ec6d-4114-bf88-12a6af9cef2c', '23', 'Creuse', 46.0500, 2.0300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b3972f3d-0335-4a10-a171-e91cd94379f9', '24', 'Dordogne', 45.1000, 0.7400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('6d987fd7-6bf0-4b36-93b0-810819e25bce', '25', 'Doubs', 47.1200, 6.3800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b4f302ad-c7a5-4578-aa0f-0b8e9049e1e7', '26', 'Drôme', 44.7100, 5.1400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('c56ac115-8ded-4c0a-9ff5-b80ec5981c67', '27', 'Eure', 49.0700, 1.1800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('e8aff1fc-3c3f-4feb-8ede-9064b90a1e90', '28', 'Eure-et-Loir', 48.4400, 1.3700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5ff4b8a4-7640-4a5e-b171-185e65ba6e68', '29', 'Finistère', 48.2300, -4.0700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5929b2fe-d7ea-4e3c-8df7-32530f029085', '30', 'Gard', 43.9500, 4.1600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('cc596fda-e533-49b2-9436-192cf75156cf', '31', 'Haute-Garonne', 43.3700, 1.2500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f551d9f2-10c5-4696-940b-106288eabe84', '32', 'Gers', 43.6500, 0.5900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('734e0003-4239-49bd-b5ea-a86809ceb9f8', '33', 'Gironde', 44.8400, -0.5800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('77c810b6-229f-427b-9635-fcf556e4fd03', '34', 'Hérault', 43.5900, 3.2500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('29c39680-9436-4da5-9741-db05add32c2b', '35', 'Ille-et-Vilaine', 48.1400, -1.5900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('a1f4ce24-f7b2-4113-9087-5596952397fd', '36', 'Indre', 46.6800, 1.5100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('9fb28c0d-d34a-4cfc-8f0a-dd99a2a691ad', '37', 'Indre-et-Loire', 47.3000, 0.6800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('cd85f765-801e-4f5f-ba2e-e393f74d7d11', '38', 'Isère', 45.1900, 5.7100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('1e9fd867-76ff-47a5-a0e1-b4333c6810fa', '39', 'Jura', 46.6700, 5.5600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('bc55e10c-76d4-4e2f-8a1d-9efbd9fefed9', '40', 'Landes', 43.9400, -0.7500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('df13fad6-574c-46e4-8911-cf72460eac7e', '41', 'Loir-et-Cher', 47.5900, 1.3400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('ec79216b-6fdf-4031-9c96-4612bfbd43d3', '42', 'Loire', 45.7200, 4.0200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('929faecc-23a4-4252-9031-3fa2ead35a10', '43', 'Haute-Loire', 45.0800, 3.8800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b83febcd-10b6-4116-9a00-c50a4b7395f7', '44', 'Loire-Atlantique', 47.3500, -1.5500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b142e3b7-9128-456c-b926-09c7f7ed61f0', '45', 'Loiret', 47.9000, 2.1600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5344e013-eab2-4001-ae83-a2026557d189', '46', 'Lot', 44.6200, 1.6800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f63235cd-1951-4206-ad91-f62db19e7cac', '47', 'Lot-et-Garonne', 44.3500, 0.4600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('df8ef502-e06d-4d53-9802-d6404e82e0f2', '48', 'Lozère', 44.5100, 3.5000, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('74a725e6-c114-4fe6-92f3-d90bc3fad6ce', '49', 'Maine-et-Loire', 47.4600, -0.5500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('f01e8962-4ba1-47c4-8578-2ea33bb8e768', '50', 'Manche', 49.1200, -1.3100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('97cdae97-7223-46f8-9b7d-3b6ef333df71', '51', 'Marne', 49.0500, 4.3700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('c5f18dc7-8d76-4465-8be2-2fc2831557f3', '52', 'Haute-Marne', 48.1100, 5.3100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('8dd551b3-45a7-4d8b-a5cf-b803e5929db0', '53', 'Mayenne', 48.1500, -0.6100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('7357cb37-8fd7-41ac-8011-e55e78bc6a84', '54', 'Meurthe-et-Moselle', 48.6800, 6.1800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('22895837-b3d1-4df5-bf80-a13ff12e689f', '55', 'Meuse', 49.1600, 5.3700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('1af0905e-49c9-4386-ac0f-a656bac85364', '56', 'Morbihan', 47.8600, -2.8100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('2f90d8de-1224-4134-b9e2-4692fae1d772', '57', 'Moselle', 49.1200, 6.7100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('7108d333-36bf-4aff-b515-b4429570b999', '58', 'Nièvre', 47.1100, 3.5000, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('873057a4-4e9a-403f-a749-42e467e05e16', '59', 'Nord', 50.4600, 3.0800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('0ee430bd-a980-4f7b-bafc-5c1560ab25e4', '60', 'Oise', 49.4200, 2.3900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('94ecce8a-4528-4bb6-beed-fdf304b2e8ec', '61', 'Orne', 48.5500, 0.0800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('596ce03b-d4bf-4639-bd50-ed8b6a52c096', '62', 'Pas-de-Calais', 50.5200, 2.1400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b426058c-e06a-4f28-a803-dc59a33c0ab5', '63', 'Puy-de-Dôme', 45.7200, 3.1800, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5fc8aa83-5bdb-4215-b7cd-b98a8b473d14', '64', 'Pyrénées-Atlantiques', 43.2800, -0.5600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('c642eda8-c22f-4e10-9f77-db15d0683581', '65', 'Hautes-Pyrénées', 43.1100, 0.1700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('5a9263f5-23b5-4f8a-8116-a433302579d0', '66', 'Pyrénées-Orientales', 42.6500, 2.4700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b0536aa4-95a4-4f41-9c55-166359c9655b', '67', 'Bas-Rhin', 48.5400, 7.5600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('adf060d7-4ef6-47a5-833b-95b1c707a9e1', '68', 'Haut-Rhin', 47.9800, 7.3400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('3cdea8dd-d81e-4f1d-9045-6e96bb0f7cde', '69', 'Rhône', 45.7400, 4.6200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d88fdabd-69a0-4a01-90ff-38fa9cd8e93d', '70', 'Haute-Saône', 47.6300, 6.0900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('71655e63-5282-440a-83aa-e2386b827b2c', '71', 'Saône-et-Loire', 46.6500, 4.7000, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('ea8ebc1e-5f95-48ce-8425-0e0f3eb5548c', '72', 'Sarthe', 48.0000, 0.1900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('017b8ad2-c83c-4288-bdbe-720b65ca999e', '73', 'Savoie', 45.4700, 6.4300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('fba90037-851d-4402-ba86-f0f137d0e21d', '74', 'Haute-Savoie', 45.9200, 6.4700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('4712f629-2afd-4a86-be21-e385f5e5d99f', '75', 'Paris', 48.8600, 2.3500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('4467d462-3221-4e8f-a7ea-443a47211f38', '76', 'Seine-Maritime', 49.6900, 0.9000, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('9a23027e-f048-4ff0-879b-77e1f819f5f3', '77', 'Seine-et-Marne', 48.6300, 2.9900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('25eb6b9d-5906-4e7b-a5a1-976ff754ba6d', '78', 'Yvelines', 48.7800, 1.7500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d69691fe-ee3b-4b0e-830c-72226e0c6271', '79', 'Deux-Sèvres', 46.5500, -0.3300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b9581201-06c3-4bb4-8ae1-01da750a3675', '80', 'Somme', 49.9200, 2.3200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d37e62e9-73d1-4ac7-a3d9-aed735d36ba9', '81', 'Tarn', 43.7100, 2.1400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('2d1899b5-412a-477d-8ce1-d3108d68768f', '82', 'Tarn-et-Garonne', 44.0800, 1.3100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('145bdeda-e2bf-43bd-92cc-e4fe462b9dc3', '83', 'Var', 43.4500, 6.2200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('991ab230-8432-4675-ad6b-b3c4e4877fd3', '84', 'Vaucluse', 44.0500, 5.1600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('0e87f61a-adcb-4f59-972e-9fefe91d27c3', '85', 'Vendée', 46.6700, -1.4100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b6cac75d-7eaa-4cea-b21e-888ab3971387', '86', 'Vienne', 46.5800, 0.3400, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('54104cb4-a479-4f17-bd89-98ef2c143d2b', '87', 'Haute-Vienne', 45.8500, 1.3100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('ee1ebabc-6817-4a42-a4f2-64708f57938a', '88', 'Vosges', 48.1700, 6.4900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('3ef0eacd-7b0d-4abb-888d-b41f19023f77', '89', 'Yonne', 47.8000, 3.5700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d26de6b0-2e68-4091-a08a-83f81bd7f534', '90', 'Territoire de Belfort', 47.6400, 6.8600, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('cc710e6a-22fb-47be-a4f4-83f70e553ea0', '91', 'Essonne', 48.5300, 2.2500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('4cdbf15f-dbb5-4e06-88e8-90902b7278c1', '92', 'Hauts-de-Seine', 48.8400, 2.1900, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('d7a76eb3-dc3f-476e-943a-e39fe09a3916', '93', 'Seine-Saint-Denis', 48.9300, 2.4700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('962e25ea-ee35-492f-99b0-90e096e78d43', '94', 'Val-de-Marne', 48.7800, 2.4700, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('e0d616aa-71a7-4907-af44-1880f24a267a', '95', 'Val-d''Oise', 49.0800, 2.1100, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('23f2e65e-71fc-4502-962e-5e1ffded1815', '971', 'Guadeloupe', 16.2700, -61.5500, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('12d64aa5-1144-4053-abbf-1c1cd1c15e05', '972', 'Martinique', 14.6400, -61.0200, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('940746cd-775d-4d18-8e3c-6144abbc5651', '973', 'Guyane', 3.9300, -53.1300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('25176394-e65e-4b8c-af9d-6b576b53bf98', '974', 'La Réunion', -21.1100, 55.5300, 'FR');
INSERT INTO public.hail_departments (id, code, name, lat, lon, country_code) VALUES ('b7c45917-b8d2-4201-a01f-09749414a4b1', '976', 'Mayotte', -12.8200, 45.1500, 'FR');


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.subscription_plans (id, name, price_cents, stripe_price_id, description, created_at, code) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'free', 0, NULL, 'Plan gratuit avec fonctionnalités de base', '2025-05-04 12:37:34.815963+00', 'FREE');
INSERT INTO public.subscription_plans (id, name, price_cents, stripe_price_id, description, created_at, code) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'premium', 4900, NULL, 'Plan premium : toutes les fonctionnalités', '2026-11-25 21:44:21.129043+00', 'PREMIUM');


--
-- Data for Name: plan_features; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'max_seats', '2');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'quote_email_sending', 'false');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'car_view', 'false');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'quote_to_invoice', 'true');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'max_seats', '10');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'max_garages', 'null');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'max_quotes_per_month', 'null');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'max_invoices_per_month', 'null');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'quote_email_sending', 'true');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'car_view', 'true');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'quote_to_invoice', 'true');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'max_garages', '1');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'max_quotes_per_month', '10');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'max_invoices_per_month', '5');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'max_conversions_per_month', '3');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'max_conversions_per_month', 'null');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('3546caed-87ba-40ac-99ce-9e113e0afd52', 'invoice_email_sending', 'false');
INSERT INTO public.plan_features (plan_id, feature_key, value) VALUES ('9e3cf944-b22f-4ad8-87a0-2e579b3cd75b', 'invoice_email_sending', 'true');


--
-- Data for Name: repair_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.repair_types (id, name, code) VALUES ('e9f11b81-2fa3-49dd-b15c-6070a8592972', 'DAP', 'dap');
INSERT INTO public.repair_types (id, name, code) VALUES ('9eecc08a-b438-4633-aff9-263732abe6af', 'DSP', 'dsp');
INSERT INTO public.repair_types (id, name, code) VALUES ('9c3663dc-8559-43eb-b6dd-4bedeb6478fa', 'Echange', 'echange');


--
-- PostgreSQL database dump complete
--


