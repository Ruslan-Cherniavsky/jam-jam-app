import React from "react"
import {Row, Col} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faInstagram,
  faFacebook,
  faSoundcloud,
  faTwitter,
  faYoutube,
  faGoogle,
  faTiktok,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons"

interface SocialMediaLinksProps {
  socialLinks: string[]
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({socialLinks}) => {
  const iconColor = "#BCBCBC" // Specify the desired color here
  const iconSpacing = "12px" // Specify the desired spacing here

  const socialMediaIcons: Record<string, IconDefinition> = {
    instagram: faInstagram,
    facebook: faFacebook,
    youtube: faYoutube,
    tiktok: faTiktok,
    soundcloud: faSoundcloud,
    twitter: faTwitter,
    google: faGoogle,
    // Add more social networks if needed
  }

  // Implement a function to get the social network name from the URL
  const getSocialNetworkName = (url: string): string | undefined => {
    const networkNames: {[key: string]: string} = {
      instagram: "instagram",
      facebook: "facebook",
      youtube: "youtube",
      tiktok: "tiktok",
      soundcloud: "soundcloud",
      twitter: "twitter",
      google: "google",
      // Add more social networks if needed
    }

    const matchingNetwork = Object.keys(networkNames).find((network) =>
      url.toLowerCase().includes(network)
    )

    return matchingNetwork ? networkNames[matchingNetwork] : undefined
  }

  return (
    <>
      {socialLinks.filter((link) => link.trim() !== "").length > 0 ? (
        <hr />
      ) : null}{" "}
      <Row>
        <Col>
          {socialLinks.map((url, index) => {
            const network = getSocialNetworkName(url)
            const icon = network
              ? socialMediaIcons[network as keyof typeof socialMediaIcons]
              : undefined

            if (icon) {
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FontAwesomeIcon
                    icon={icon}
                    size="2x"
                    className="mr-2"
                    style={{color: iconColor, marginRight: iconSpacing}}
                  />
                </a>
              )
            }
            return null // Handle unsupported or unrecognized social networks
          })}
        </Col>
      </Row>
    </>
  )
}

export default SocialMediaLinks
