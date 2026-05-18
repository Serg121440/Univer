import xml.etree.ElementTree as ET

def validate_yml(content: str):
    """
    Validates YML (Yandex Market Language) content.
    Checks for basic XML structure and required fields.
    """
    try:
        root = ET.fromstring(content)
        if root.tag != 'yml_catalog':
            return {"valid": False, "error": "Root tag must be yml_catalog"}

        shop = root.find('shop')
        if shop is None:
            return {"valid": False, "error": "Missing <shop> tag"}

        offers = shop.find('offers')
        if offers is None:
            return {"valid": False, "error": "Missing <offers> tag"}

        offer_list = offers.findall('offer')
        if not offer_list:
            return {"valid": False, "error": "No <offer> tags found"}

        return {"valid": True, "offer_count": len(offer_list)}
    except ET.ParseError as e:
        return {"valid": False, "error": f"XML Parse Error: {str(e)}"}
    except Exception as e:
        return {"valid": False, "error": str(e)}
