import {ValueSetsResponse} from 'shared/model';

export class ValueSetsResponseMock {
	static valueSets: ValueSetsResponse = {
		countryCodes: {
			de: [
				{
					display: 'Schweden',
					lang: 'de',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Schweiz',
					lang: 'de',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			fr: [
				{
					display: 'Suède',
					lang: 'fr',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Suisse',
					lang: 'fr',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			it: [
				{
					display: 'Svezia',
					lang: 'it',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Svizzera',
					lang: 'it',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			en: [
				{
					display: 'Sweden',
					lang: 'en',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Switzerland',
					lang: 'en',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			]
		},
		vaccinationSets: [
			{
				productCode: 'BBIBP-CorV',
				productDisplay: 'BBIBP-CorV (Vero Cells)',
				prophylaxisCode: 'J07BX03',
				prophylaxisDisplay: 'covid-19 vaccines',
				authHolderCode: 'ORG-100020693',
				authHolderDisplay: 'China Sinopharm International Corp. - Beijing location',
				issuable: 'ABROAD_ONLY',
				touristVaccine: false
			},
			{
				productCode: 'EU/1/20/1528',
				productDisplay: 'Comirnaty',
				prophylaxisCode: '1119349007',
				prophylaxisDisplay: 'SARS-CoV-2 mRNA vaccine',
				authHolderCode: 'ORG-100030215',
				authHolderDisplay: 'Biontech Manufacturing GmbH',
				issuable: 'CH_AND_ABROAD',
				touristVaccine: false
			},
			{
				productCode: 'EU/1/20/1525',
				productDisplay: 'COVID-19 Vaccine Janssen',
				prophylaxisCode: 'J07BX03',
				prophylaxisDisplay: 'covid-19 vaccines',
				authHolderCode: 'ORG-100001417',
				authHolderDisplay: 'Janssen-Cilag International',
				issuable: 'CH_AND_ABROAD',
				touristVaccine: false
			},
			{
				productCode: 'CoronaVac',
				productDisplay: 'COVID-19 Vaccine (Vero Cell), Inactivated/ Coronavac',
				prophylaxisCode: 'J07BX03',
				prophylaxisDisplay: 'covid-19 vaccines',
				authHolderCode: 'Sinovac-Biotech',
				authHolderDisplay: 'Sinovac Biotech',
				issuable: 'ABROAD_ONLY',
				touristVaccine: false
			},
			{
				productCode: 'Covishield',
				productDisplay: 'Covishield (ChAdOx1_nCoV-19)',
				prophylaxisCode: 'J07BX03',
				prophylaxisDisplay: 'covid-19 vaccines',
				authHolderCode: 'ORG-100001981',
				authHolderDisplay: 'Serum Institute Of India Private Limited',
				issuable: 'ABROAD_ONLY',
				touristVaccine: false
			},
			{
				productCode: 'EU/1/20/1507',
				productDisplay: 'Spikevax (previously COVID-19 Vaccine Moderna)',
				prophylaxisCode: '1119349007',
				prophylaxisDisplay: 'SARS-CoV-2 mRNA vaccine',
				authHolderCode: 'ORG-100031184',
				authHolderDisplay: 'Moderna Biotech Spain S.L.',
				issuable: 'CH_AND_ABROAD',
				touristVaccine: false
			},
			{
				productCode: 'EU/1/21/1529',
				productDisplay: 'Vaxzevria',
				prophylaxisCode: 'J07BX03',
				prophylaxisDisplay: 'covid-19 vaccines',
				authHolderCode: 'ORG-100001699',
				authHolderDisplay: 'AstraZeneca AB',
				issuable: 'ABROAD_ONLY',
				touristVaccine: true
			}
		],
		testSets: [
			{
				code: '1833',
				display: 'AAZ-LMB, COVID-VIRO',
				validUntil: null
			},
			{
				code: '1232',
				display: 'Abbott Rapid Diagnostics, Panbio Covid-19 Ag Rapid Test',
				validUntil: null
			},
			{
				code: '1457',
				display: 'Acon Biotech (Hangzhou) Co., Ltd, SARS-CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1468',
				display: 'ACON Laboratories, Inc, Flowflex SARS-CoV-2 Antigen rapid test',
				validUntil: null
			},
			{
				code: '2108',
				display: 'AESKU.DIAGNOSTICS GmbH & Co. KG, AESKU.RAPID SARS-CoV-2',
				validUntil: null
			},
			{
				code: '2130',
				display: 'Affimedix, Inc., TestNOW® - COVID-19 Antigen Test',
				validUntil: null
			},
			{
				code: '1304',
				display: 'AMEDA Labordiagnostik GmbH, AMP Rapid Test SARS-CoV-2 Ag',
				validUntil: null
			},
			{
				code: '1822',
				display: 'Anbio (Xiamen) Biotechnology Co., Ltd, Rapid COVID-19 Antigen Test(Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1736',
				display: 'Anhui Deep Blue Medical Technology Co., Ltd, COVID-19 (SARS-CoV-2) Antigen Test Kit(Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1815',
				display: 'Anhui Deep Blue Medical Technology Co., Ltd, COVID-19 (SARS-CoV-2) Antigen Test Kit (Colloidal Gold) - Nasal Swab',
				validUntil: null
			},
			{
				code: '768',
				display: 'ArcDia International Ltd, mariPOC SARS-CoV-2',
				validUntil: null
			},
			{
				code: '2079',
				display: 'ArcDia International Oy Ltd, mariPOC Quick Flu+',
				validUntil: null
			},
			{
				code: '2078',
				display: 'ArcDia International Oy Ltd, mariPOC Respi+',
				validUntil: null
			},
			{
				code: '1618',
				display: 'Artron Laboratories Inc, Artron COVID-19 Antigen Test',
				validUntil: null
			},
			{
				code: '1654',
				display: 'Asan Pharmaceutical CO., LTD, Asan Easy Test COVID-19 Ag',
				validUntil: null
			},
			{
				code: '770',
				display: 'Assure Tech. (Hangzhou) Co., Ltd, ECOTEST COVID-19 Antigen Rapid Test Device',
				validUntil: null
			},
			{
				code: '2350',
				display: 'Assure Tech. (Hangzhou) Co., Ltd., ECOTEST COVID-19 Antigen Rapid Test Device',
				validUntil: null
			},
			{
				code: '2010',
				display: 'Atlas Link Technology Co., Ltd., NOVA Test® SARS-CoV-2 Antigen Rapid Test Kit (Colloidal Gold Immunochromatography)',
				validUntil: null
			},
			{
				code: '1800',
				display: 'AVALUN SAS, Ksmart® SARS-COV2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '2101',
				display: 'AXIOM Gesellschaft für Diagnostica und Biochemica mbH, COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1906',
				display: 'Azure Biotech Inc, COVID-19 Antigen Rapid Test Device',
				validUntil: null
			},
			{
				code: '1065',
				display: 'Becton Dickinson, BD Veritor™ System for Rapid Detection of SARS CoV 2',
				validUntil: null
			},
			{
				code: '1870',
				display: 'Beijing Hotgen Biotech Co., Ltd, Novel Coronavirus 2019-nCoV Antigen Test (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '2072',
				display: 'Beijing Jinwofu Bioengineering Technology Co.,Ltd., Novel Coronavirus (SARS-CoV-2) Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1331',
				display: 'Beijing Lepu Medical Technology Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1485',
				display: 'Beijing Wantai Biological Pharmacy Enterprise Co., Ltd, WANTAI SARS-CoV-2 Ag Rapid Test (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1484',
				display: 'Beijing Wantai Biological Pharmacy Enterprise Co., Ltd, Wantai SARS-CoV-2 Ag Rapid Test (FIA)',
				validUntil: null
			},
			{
				code: '2247',
				display: 'BioGnost Ltd, CoviGnost AG Test Device 1x20',
				validUntil: null
			},
			{
				code: '1286',
				display: 'BIOHIT HealthCare (Hefei) Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit (Fluorescence Immunochromatography)',
				validUntil: null
			},
			{
				code: '2035',
				display: 'BioMaxima SA, SARS-CoV-2 Ag Rapid Test',
				validUntil: null
			},
			{
				code: '1599',
				display: 'Biomerica, Inc., Biomerica COVID-19 Antigen Rapid Test (nasopharyngeal swab)',
				validUntil: null
			},
			{
				code: '1242',
				display: 'Bionote, Inc, NowCheck COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '2031',
				display: 'Bio-Rad Laboratories / Zhejiang Orient Gene Biotech, Coronavirus Ag Rapid Test Cassette (Swab)',
				validUntil: null
			},
			{
				code: '1223',
				display: 'BIOSYNEX S.A., BIOSYNEX COVID-19 Ag BSS',
				validUntil: null
			},
			{
				code: '1494',
				display: 'BIOSYNEX S.A., BIOSYNEX COVID-19 Ag+ BSS',
				validUntil: null
			},
			{
				code: '2067',
				display: 'BIOTEKE CORPORATION (WUXI) CO., LTD, SARS-CoV-2 Antigen Test Kit (colloidal gold method)',
				validUntil: null
			},
			{
				code: '2013',
				display: 'Biotical Health S.L.U., biotical SARS-CoV-2 Ag Card',
				validUntil: null
			},
			{
				code: '1989',
				display: 'Boditech Med Inc, AFIAS COVID-19 Ag',
				validUntil: null
			},
			{
				code: '1236',
				display: 'BTNX Inc, Rapid Response COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1173',
				display: 'CerTest Biotec, CerTest SARS-CoV-2 Card test',
				validUntil: null
			},
			{
				code: '1919',
				display: 'Core Technology Co., Ltd, Coretests COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '1581',
				display: 'CTK Biotech, Inc, OnSite COVID-19 Ag Rapid Test',
				validUntil: null
			},
			{
				code: '1225',
				display: 'DDS DIAGNOSTIC, Test Rapid Covid-19 Antigen (tampon nazofaringian)',
				validUntil: null
			},
			{
				code: '1375',
				display: 'DIALAB GmbH, DIAQUICK COVID-19 Ag Cassette',
				validUntil: null
			},
			{
				code: '2242',
				display: 'DNA Diagnostic, COVID-19 Antigen Detection Kit',
				validUntil: null
			},
			{
				code: '1243',
				display: 'Edinburgh Genetics Limited, ActivXpress+ COVID-19 Antigen Complete Testing Kit',
				validUntil: null
			},
			{
				code: '1739',
				display: 'Eurobio Scientific, EBS SARS-CoV-2 Ag Rapid Test',
				validUntil: null
			},
			{
				code: '2147',
				display: 'Fujirebio, ESPLINE SARS-CoV-2',
				validUntil: null
			},
			{
				code: '1855',
				display: 'GA Generic Assays GmbH, GA CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1244',
				display: 'GenBody, Inc, Genbody COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '2012',
				display: 'Genrui Biotech Inc, SARS-CoV-2 Antigen Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1253',
				display: 'GenSure Biotech Inc, GenSure COVID-19 Antigen Rapid Kit',
				validUntil: null
			},
			{
				code: '2183',
				display: 'Getein Biotech, Inc., One Step Test for SARS-CoV-2 Antigen (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1820',
				display: 'Getein Biotech, Inc, SARS-CoV-2 Antigen (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1197',
				display: 'Goldsite Diagnostics Inc, SARS-CoV-2 Antigen Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1144',
				display: 'Green Cross Medical Science Corp., GENEDIA W COVID-19 Ag',
				validUntil: null
			},
			{
				code: '1747',
				display: 'Guangdong Hecin Scientific, Inc., 2019-nCoV Antigen Test Kit (colloidal gold method)',
				validUntil: null
			},
			{
				code: '1216',
				display: 'Guangdong Longsee Biomedical Co., Ltd, COVID-19 Ag Rapid Test Kit (Immuno-Chromatography)',
				validUntil: null
			},
			{
				code: '1360',
				display: 'Guangdong Wesail Biotech Co., Ltd, COVID-19 Ag Test Kit',
				validUntil: null
			},
			{
				code: '1324',
				display: 'Guangzhou Decheng Biotechnology Co., LTD, V-CHEK, 2019-nCoV Ag Rapid Test Kit (Immunochromatography)',
				validUntil: null
			},
			{
				code: '1437',
				display: 'Guangzhou Wondfo Biotech Co., Ltd, Wondfo 2019-nCoV Antigen Test (Lateral Flow Method)',
				validUntil: null
			},
			{
				code: '1257',
				display: 'Hangzhou AllTest Biotech Co., Ltd, COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1610',
				display: 'Hangzhou Clongene Biotech Co., Ltd, COVID-19 Antigen Rapid Test Cassette',
				validUntil: null
			},
			{
				code: '1363',
				display: 'Hangzhou Clongene Biotech Co., Ltd, Covid-19 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1365',
				display: 'Hangzhou Clongene Biotech Co., Ltd, COVID-19/Influenza A+B Antigen Combo Rapid Test',
				validUntil: null
			},
			{
				code: '1844',
				display: 'Hangzhou Immuno Biotech Co.,Ltd, Immunobio SARS-CoV-2 Antigen ANTERIOR NASAL Rapid Test Kit (minimal invasive)',
				validUntil: null
			},
			{
				code: '2317',
				display: 'Hangzhou Immuno Biotech Co.,Ltd, SARS-CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1215',
				display: 'Hangzhou Laihe Biotech Co., Ltd, LYHER Novel Coronavirus (COVID-19) Antigen Test Kit(Colloidal Gold)',
				validUntil: null
			},
			{
				code: '2139',
				display: 'HANGZHOU LYSUN BIOTECHNOLOGY CO., LTD., COVID-19 Antigen Rapid Test Device（Colloidal Gold）',
				validUntil: null
			},
			{
				code: '1392',
				display: 'Hangzhou Testsea Biotechnology Co., Ltd, COVID-19 Antigen Test Cassette',
				validUntil: null
			},
			{
				code: '1767',
				display: 'Healgen Scientific, Coronavirus Ag Rapid Test Cassette',
				validUntil: null
			},
			{
				code: '1759',
				display: 'Hubei Jinjian Biology Co., Ltd, SARS-CoV-2 Antigen Test Kit',
				validUntil: null
			},
			{
				code: '1263',
				display: 'Humasis, Humasis COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '2107',
				display: 'Jiangsu Bioperfectus Technologies Co., Ltd., Novel Corona Virus (SARS-CoV-2) Ag Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1920',
				display: 'Jiangsu Diagnostics Biotechnology Co.,Ltd., COVID-19 Antigen Rapid Test Cassette (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '2006',
				display: 'Jiangsu Medomics medical technology Co.,Ltd., SARS-CoV-2 antigen Test Kit (LFIA)',
				validUntil: null
			},
			{
				code: '1333',
				display: 'Joinstar Biomedical Technology Co., Ltd, COVID-19 Rapid Antigen Test (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1764',
				display: 'JOYSBIO (Tianjin) Biotechnology Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1266',
				display: 'Labnovation Technologies Inc, SARS-CoV-2 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '2128',
				display: 'Lumigenex (Suzhou) Co., Ltd, PocRoc®SARS-CoV-2 Antigen Rapid Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1267',
				display: 'LumiQuick Diagnostics Inc, QuickProfile COVID-19 Antigen Test',
				validUntil: null
			},
			{
				code: '1268',
				display: 'LumiraDX, LumiraDx SARS-CoV-2 Ag Test',
				validUntil: null
			},
			{
				code: '1180',
				display: 'MEDsan GmbH, MEDsan SARS-CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '2029',
				display: 'Merlin Biomedical (Xiamen) Co., Ltd., SARS-CoV-2 Antigen Rapid Test Cassette',
				validUntil: null
			},
			{
				code: '1775',
				display: 'MEXACARE GmbH, MEXACARE COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1190',
				display: 'möLab, mö-screen Corona Antigen Test',
				validUntil: null
			},
			{
				code: '1481',
				display: 'MP Biomedicals, Rapid SARS-CoV-2 Antigen Test Card',
				validUntil: null
			},
			{
				code: '2104',
				display: 'Nal von minden GmbH, NADAL COVID -19 Ag +Influenza A/B Test',
				validUntil: null
			},
			{
				code: '1162',
				display: 'Nal von minden GmbH, NADAL COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '1420',
				display: 'NanoEntek, FREND COVID-19 Ag',
				validUntil: null
			},
			{
				code: '2200',
				display: 'NanoRepro AG, NanoRepro SARS-CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '2241',
				display: 'NESAPOR EUROPA SL, MARESKIT',
				validUntil: null
			},
			{
				code: '1501',
				display: 'New Gene (Hangzhou) Bioengineering Co., Ltd, COVID-19 Antigen Detection Kit',
				validUntil: null
			},
			{
				code: '1762',
				display: 'Novatech, SARS CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1199',
				display: 'Oncosem Onkolojik Sistemler San. ve Tic. A.S., CAT',
				validUntil: null
			},
			{
				code: '2243',
				display: 'PCL Inc., PCL COVID19 Ag Gold',
				validUntil: null
			},
			{
				code: '308',
				display: 'PCL Inc, PCL COVID19 Ag Rapid FIA',
				validUntil: null
			},
			{
				code: '2116',
				display: 'PerGrande BioTech Development Co., Ltd., SARS-CoV-2 Antigen Detection Kit (Colloidal Gold Immunochromatographic Assay)',
				validUntil: null
			},
			{
				code: '1271',
				display: 'Precision Biosensor, Inc, Exdia COVID-19 Ag',
				validUntil: null
			},
			{
				code: '1495',
				display: 'Prognosis Biotech, Rapid Test Ag 2019-nCov',
				validUntil: null
			},
			{
				code: '1341',
				display: 'Qingdao Hightop Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test (Immunochromatography)',
				validUntil: null
			},
			{
				code: '1097',
				display: 'Quidel Corporation, Sofia SARS Antigen FIA',
				validUntil: null
			},
			{
				code: '2290',
				display: 'Rapid Pathogen Screening, Inc., LIAISON® Quick Detect Covid Ag Assay',
				validUntil: null
			},
			{
				code: '1604',
				display: 'Roche (SD BIOSENSOR), SARS-CoV-2 Rapid Antigen Test',
				validUntil: null
			},
			{
				code: '2228',
				display: 'Roche (SD BIOSENSOR), SARS-CoV-2 Rapid Antigen Test Nasal',
				validUntil: null
			},
			{
				code: '1489',
				display: 'Safecare Biotech (Hangzhou) Co. Ltd, COVID-19 Antigen Rapid Test Kit (Swab)',
				validUntil: null
			},
			{
				code: '1490',
				display: 'Safecare Biotech (Hangzhou) Co. Ltd, Multi-Respiratory Virus Antigen Test Kit(Swab)  (Influenza A+B/ COVID-19)',
				validUntil: null
			},
			{
				code: '1201',
				display: 'ScheBo Biotech AG, ScheBo SARS CoV-2 Quick Antigen',
				validUntil: null
			},
			{
				code: '344',
				display: 'SD BIOSENSOR Inc, STANDARD F COVID-19 Ag FIA',
				validUntil: null
			},
			{
				code: '345',
				display: 'SD BIOSENSOR Inc, STANDARD Q COVID-19 Ag Test',
				validUntil: null
			},
			{
				code: '2052',
				display: 'SD BIOSENSOR Inc, STANDARD Q COVID-19 Ag Test Nasal',
				validUntil: null
			},
			{
				code: '1319',
				display: 'SGA Medikal, V-Chek SARS-CoV-2 Ag Rapid Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1357',
				display: 'SGA Medikal, V-Chek SARS-CoV-2 Rapid Ag Test (colloidal gold)',
				validUntil: null
			},
			{
				code: '2109',
				display: 'Shenzhen Lvshiyuan Biotechnology Co., Ltd., Green Spring SARS-CoV-2 Antigen-Rapid test-Set',
				validUntil: null
			},
			{
				code: '1967',
				display: 'Shenzhen Microprofit Biotech Co., Ltd, SARS-CoV-2 Antigen Test Kit (Colloidal Gold Chromatographic Immunoassay)',
				validUntil: null
			},
			{
				code: '1178',
				display: 'Shenzhen Microprofit Biotech Co., Ltd, SARS-CoV-2 Spike Protein Test Kit (Colloidal Gold Chromatographic Immunoassay)',
				validUntil: null
			},
			{
				code: '2017',
				display: 'Shenzhen Ultra-Diagnostics Biotec.Co.,Ltd, SARS-CoV-2 Antigen Test Kit',
				validUntil: null
			},
			{
				code: '1769',
				display: 'Shenzhen Watmind Medical Co., Ltd, SARS-CoV-2 Ag Diagnostic Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1768',
				display: 'Shenzhen Watmind Medical Co., Ltd, SARS-CoV-2 Ag Diagnostic Test Kit (Immuno-fluorescence)',
				validUntil: null
			},
			{
				code: '1574',
				display: 'Shenzhen Zhenrui Biotechnology Co., Ltd, Zhenrui ®COVID-19 Antigen Test Cassette',
				validUntil: null
			},
			{
				code: '1218',
				display: 'Siemens Healthineers, CLINITEST Rapid Covid-19 Antigen Test',
				validUntil: null
			},
			{
				code: '1114',
				display: 'Sugentech, Inc, SGTi-flex COVID-19 Ag',
				validUntil: null
			},
			{
				code: '1466',
				display: 'TODA PHARMA, TODA CORONADIAG Ag',
				validUntil: null
			},
			{
				code: '2074',
				display: 'Triplex International Biosciences (China) Co., LTD., SARS-CoV-2 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1465',
				display: 'Triplex International Biosciences Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1443',
				display: 'Vitrosens Biotechnology Co., Ltd, RapidFor SARS-CoV-2 Rapid Ag Test',
				validUntil: null
			},
			{
				code: '2103',
				display: 'VivaChek Biotech (Hangzhou) Co., Ltd, VivaDiag Pro SARS-CoV-2 Ag Rapid Test',
				validUntil: null
			},
			{
				code: '2098',
				display: 'Wuhan EasyDiagnosis Biomedicine Co., Ltd., COVID-19 (SARS-CoV-2) Antigen Test Kit',
				validUntil: null
			},
			{
				code: '1773',
				display: 'Wuhan Life Origin Biotech Joint Stock Co., Ltd., The SARS-CoV-2 Antigen Assay Kit (Immunochromatography)',
				validUntil: null
			},
			{
				code: '2090',
				display: 'Wuhan UNscience Biotechnology Co., Ltd., SARS-CoV-2 Antigen Rapid Test Kit',
				validUntil: null
			},
			{
				code: '1763',
				display: 'Xiamen AmonMed Biotechnology Co., Ltd, COVID-19 Antigen Rapid Test Kit (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1278',
				display: 'Xiamen Boson Biotech Co. Ltd, Rapid SARS-CoV-2 Antigen Test Card',
				validUntil: null
			},
			{
				code: '1456',
				display: 'Xiamen Wiz Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1884',
				display: 'Xiamen Wiz Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test (Colloidal Gold)',
				validUntil: null
			},
			{
				code: '1296',
				display: 'Zhejiang Anji Saianfu Biotech Co., Ltd, AndLucky COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1295',
				display: 'Zhejiang Anji Saianfu Biotech Co., Ltd, reOpenTest COVID-19 Antigen Rapid Test',
				validUntil: null
			},
			{
				code: '1343',
				display: 'Zhezhiang Orient Gene Biotech Co., Ltd, Coronavirus Ag Rapid Test Cassette (Swab)',
				validUntil: null
			},
			{
				code: '1957',
				display: 'Zhuhai Lituo Biotechnology Co., Ltd, COVID-19 Antigen Detection Kit (Colloidal Gold)',
				validUntil: null
			}
		]
	};
}
