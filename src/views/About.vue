<template>
	<b-container class="tw-py-5 tw-flex-1 scrollbar-y">
		<div class="accordion" role="tablist">
			<b-button
				class="tw-block tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.about-accordion
			>About this application</b-button>
			<b-collapse id="about-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body class="tw-px-1 tw-text-base tw-text-gray-900 tw-text-justify">
					Security and personal safety are of paramount importance and in today’s digital age, information (about security and safety) is power. Whether you are concerned about crime in your residential area or your place of work, or perhaps around the area where your dependents live, work or school, CrimeLogr is able to provide you with a comprehensive view of the crimes that have taken place and the relative level of safety in that area.
					<br />
					<br />In other words, CrimeLogr was developed out of the need for the general public to have a holistic and aggregated view (and relative indication) of crime levels in their current location or other locations of interest. This purpose is particularly necessary and helpful in developing countries where crime data is either not digitised, not available in easily accessible format or disjointed in several silos of information.
					<br />
					<br />CrimeLogr aggregates various categories of crime data using formal and semi-formal sources that have by and large been found to be plausible/valid. Please refer to our Disclaimer, Terms & Conditions, Privacy Policy and FAQs for further details.
				</b-card-body>
			</b-collapse>

			<b-button
				class="tw-block tw-mt-4 tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.faq-accordion
			>Frequently Asked Questions (FAQs)</b-button>
			<b-collapse id="faq-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body class="tw-px-1">
					<div class="tw-space-y-4">
						<div :key="faqIndex" v-for="(faq, faqIndex) in faqs">
							<h4 class="tw-text-lg tw-text-black tw-font-bold">Q:{{faq.question}}</h4>
							<div class="tw-pl-5 tw-text-base tw-text-gray-900 tw-text-justify">
								<strong>ANS:</strong>
								{{faq.answer}}
								<a :href="`mailto:${faq.email}`" v-if="faq.email">{{faq.email}}</a>
							</div>
							<template v-if="faq.items">
								<div
									class="tw-pl-5"
									:key="itemIndex"
									v-for="(item, itemIndex) in faq.items"
									:class="{'tw-mt-3': !itemIndex}"
								>
									<h5 class="tw-text-base tw-text-black tw-font-medium">{{itemIndex+1}}) {{item.title}}</h5>
									<ul class="tw-list-disc">
										<li :key="subItemIndex" v-for="(subItem, subItemIndex) in item.items">{{subItem}}</li>
									</ul>
								</div>
							</template>
						</div>
					</div>
				</b-card-body>
			</b-collapse>

			<b-button
				class="tw-block tw-mt-4 tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.termnconditions-accordion
			>Terms & Conditions</b-button>
			<b-collapse id="termnconditions-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body class="tw-px-1 tw-text-base tw-text-gray-900 tw-text-justify">
					By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app.
					<br />You’re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights and other intellectual property rights related to it, still belong to DeenBiz Ltd.
					DeenBiz Ltd is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.
					<br />The CrimeLogr app stores and processes personal data that you have provided to us, in order to provide our Service. It’s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the CrimeLogr app won’t work properly or at all.
					<br />The app does use third-party services that declare their own Terms and Conditions.
					Link to Terms and Conditions of third-party service providers used by the app. These services include (but not limited to):
					<br />
					<ul class="tw-list-disc tw-my-2">
						<li>Google Play Services</li>
						<li>AdMob</li>
						<li>Google Analytics for Firebase</li>
					</ul>You should be aware that there are certain things that DeenBiz Ltd will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi, or provided by your mobile network provider, but DeenBiz Ltd cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left.
					<br />If you’re using the app outside of an area with Wi-Fi, you should remember that your terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third-party charges. In using the app, you’re accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming. If you are not the bill payer for the device on which you’re using the app, please be aware that we assume that you have received permission from the bill payer for using the app.
					<br />Along the same lines, DeenBiz Ltd cannot take responsibility for the way you use the app i.e. You need to make sure that your device stays charged – if it runs out of battery and you can’t turn it on to avail the Service, DeenBiz Ltd cannot accept responsibility.
					With respect to DeenBiz Ltd.’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavour to ensure that it is updated and always correct, we do rely on third parties to provide information to us so that we can make it available to you. DeenBiz Ltd accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.
					<br />At some point, we may wish to update the app. The app is currently available on Android & iOS – the requirements for both systems(and for any additional systems we decide to extend the availability of the app to) may change, and you’ll need to download the updates if you want to keep using the app. DeenBiz Ltd does not promise that it will always update the app so that it is relevant to you and/or works with the Android & iOS version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device.
					<br />
					<strong>Changes to This Terms and Conditions</strong>
					<br />We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page.
					<br />These terms and conditions are effective as of 01-08-2021.
					<br />
					<strong>Contact Us</strong>
					<br />If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at
					<a
						href="mailto:info@crimelogr.com"
					>info@crimelogr.com</a>.
				</b-card-body>
			</b-collapse>

			<b-button
				class="tw-block tw-mt-4 tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.privacy-accordion
			>Privacy Policy</b-button>
			<b-collapse id="privacy-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body class="tw-px-1 tw-text-base tw-text-gray-900 tw-text-justify">
					DeenBiz Ltd built the CrimeLogr app as a Freemium app. This SERVICE is provided by DeenBiz Ltd at no cost and is intended for use as is.
					This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
					<br />If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
					<br />The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at CrimeLogr unless otherwise defined in this Privacy Policy.
					<br />
					<br />
					<strong>Information Collection and Use</strong>
					<br />For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to User Location, Age, Email Address, Gender, Contact No & Address (optional). The information that we request will be retained by us and used as described in this privacy policy.
					<br />The app does use third-party services that may collect information used to identify you.
					Link to privacy policy of third-party service providers used by the app
					<ul class="tw-list-disc tw-my-2">
						<li>Google Play Services</li>
						<li>AdMob</li>
						<li>Google Analytics for Firebase</li>
					</ul>
					<strong>Log Data</strong>
					<br />We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
					<br />
					<br />
					<strong>Cookies</strong>
					<br />Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
					<br />This Service does not use these “cookies” explicitly. However, the app may use third-party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
					<br />
					<br />
					<strong>Service Providers</strong>
					<br />We may employ third-party companies and individuals due to the following reasons:
					<ul class="tw-list-disc tw-my-2">
						<li>To facilitate our Service;</li>
						<li>To provide the Service on our behalf;</li>
						<li>To perform Service-related services; or</li>
						<li>To assist us in analysing how our Service is used.</li>
					</ul>We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
					<br />
					<br />
					<strong>Security</strong>
					<br />We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
					<br />
					<br />
					<strong>Links to Other Sites</strong>
					<br />This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
					<br />
					<br />
					<strong>Children’s Privacy</strong>
					<br />These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
					<br />
					<br />
					<strong>Changes to This Privacy Policy</strong>
					<br />We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
					<br />
					<br />This policy is effective as of 01-08-2021.
					<br />
					<br />If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at
					<a
						href="mailto:info@crimelogr.com"
					>info@crimelogr.com</a>.
				</b-card-body>
			</b-collapse>

			<b-button
				class="tw-block tw-mt-4 tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.contact-accordion
			>Contact / Message Us</b-button>
			<b-collapse id="contact-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body class="tw-px-1 tw-text-base tw-text-gray-900 tw-text-justify">
					If you have any questions or suggestions about our product/service, do not hesitate to contact us at
					<a
						href="mailto:info@crimelogr.com"
					>info@crimelogr.com</a>.
				</b-card-body>
			</b-collapse>

			<b-button
				class="tw-block tw-mt-4 tw-w-full tw-bg-green-600 tw-border-green-600"
				v-b-toggle.disclaimer-accordion
			>Disclaimer</b-button>
			<b-collapse id="disclaimer-accordion" accordion="info-accordion" role="tabpanel">
				<b-card-body
					class="tw-px-1 tw-text-base tw-text-gray-900 tw-text-justify"
				>Disclaimer for CrimeLogr: The purpose of CrimeLogr is to assist the public in appraising the level of established crime within certain towns/cities of selected countries on an advisory level. The crime data provided in geolocated map view (and subsequently as charts) has been sourced from either original/formal source of news, i.e. verified media outlets or from first-person account (as long as a reasonable level of plausibility can be established from such first-person accounts), which could emanate from ‘informal’ social media reports. Some of the crime data are reported by individuals or third parties and CrimeLogr makes the best effort to verify the plausibility of such data before it is made available to the public. Such crimes reported by third parties are visible to the public until their source and plausibility has been checked by management of CrimeLogr. The suspects or alleged perpetrators of the crimes recorded in CrimeLogr are not identified in any way and the person(s) may not have been caught, tried or punished for their crimes - and it is not the intention or purpose of this app to lead to such outcomes. Subsequently, CrimeLogr does not make any claims concerning the accuracy, validity, completeness, or reliability of any crime data recorded in this application. Neither does CrimeLogr provide any warranty concerning the accuracy or fitness for any specific individual or organisational use of the App and its data, and no warranty can be inferred or implied by any user concerning the crime data collected and presented here. This applies to all attributes of the data including the calculation of Personal Safety Index (PSI) which is essentially an advisory indicator (algorithm) suggesting how safe a person could with respect to the various crimes that have occurred in a given radius at a particular time. The use of any crime data, meta-data or information from this app is at user’s own risk. The crime data recorded in CrimeLogr is subject to change, modifications and complete removal at the discretion of DeenBiz Ltd.</b-card-body>
			</b-collapse>

			<div class="tw-mt-4">© Copyright DeenBiz Ltd 2021. All rights reserved.</div>
		</div>
	</b-container>
</template>

<script>
import faqs from '../jsons/faqs.json'
export default {
	name: 'About',
	data: () => ({
		faqs
	}),
}
</script>

<style lang="scss" scoped>
	#about {
		padding: 25px;
	}
	.buttons {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		li {
			margin-bottom: 15px;
			width: 100%;

			button {
				width: 100%;
			}
		}
	}
</style>