from pathlib import Path

import re

try:
    import fitz
except ModuleNotFoundError:
    fitz = None

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Frame,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DOC_DIR = ROOT / "assets" / "docs"
DOC_DIR.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = letter

INK = colors.HexColor("#17130f")
SOFT_INK = colors.HexColor("#3f3528")
GOLD = colors.HexColor("#c59b4a")
PALE_GOLD = colors.HexColor("#ead8a5")
MOSS = colors.HexColor("#9eb86d")
CREAM = colors.HexColor("#f6f0df")
BLACK = colors.HexColor("#050504")


def draw_doc_page(canvas, doc, title="Dov Fuchs"):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1)
    canvas.line(0.72 * inch, PAGE_H - 0.62 * inch, PAGE_W - 0.72 * inch, PAGE_H - 0.62 * inch)
    canvas.setFillColor(SOFT_INK)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.72 * inch, PAGE_H - 0.48 * inch, title.upper())
    canvas.drawRightString(PAGE_W - 0.72 * inch, 0.45 * inch, str(canvas.getPageNumber()))
    canvas.restoreState()


def p_style(name, **kwargs):
    base = getSampleStyleSheet()["BodyText"]
    return ParagraphStyle(name, parent=base, **kwargs)


DOC_STYLES = {
    "kicker": p_style(
        "kicker",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=MOSS,
        alignment=TA_LEFT,
        spaceAfter=6,
    ),
    "title": p_style(
        "title",
        fontName="Helvetica-Bold",
        fontSize=31,
        leading=34,
        textColor=INK,
        spaceAfter=8,
    ),
    "h1": p_style(
        "h1",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=INK,
        spaceBefore=12,
        spaceAfter=7,
    ),
    "body": p_style(
        "body",
        fontName="Helvetica",
        fontSize=9.2,
        leading=12.2,
        textColor=SOFT_INK,
        spaceAfter=6,
    ),
    "bullet": p_style(
        "bullet",
        fontName="Helvetica",
        fontSize=8.7,
        leading=11.4,
        leftIndent=13,
        firstLineIndent=-7,
        textColor=SOFT_INK,
        spaceAfter=4.2,
    ),
}


def build_cv():
    doc = SimpleDocTemplate(
        str(DOC_DIR / "cv.pdf"),
        pagesize=letter,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.82 * inch,
        bottomMargin=0.68 * inch,
    )
    story = [
        Paragraph("ARTISTIC CV", DOC_STYLES["kicker"]),
        Paragraph("Dov Fuchs", DOC_STYLES["title"]),
        Paragraph(
            "Digital artist based in Haifa, Israel, working with surreal self-portraiture, staged imagination, "
            "symbolic interiors, and psychological narrative.",
            DOC_STYLES["body"],
        ),
    ]

    group_exhibitions = [
        "2025 ARTS TO HEARTS Project: <i>time &amp; memory</i> (virtual). Three images displayed.",
        "2024 Annual Exhibition of Chagall House Artists, Marc Chagall Artists' House Gallery, Haifa, December 2024.",
        "2023 Annual Exhibition of Chagall House Artists, Marc Chagall Artists' House Gallery, Haifa, November 2023.",
        "ISRAELI ART 2023, Contemplor Gallery, Vienna, Austria, November 2023, curated by Menucha Cohn and Hubert Thurnhofer.",
        "THE ART OF PHOTOGRAPHY, Marc Chagall Artists' House Gallery, Haifa, September 2023, curated by Eliezer Sinai.",
        "50 and Over (Virtual), Las Lagunas Gallery, Los Angeles, California, August 2023.",
        "ANIMALS OR NOT TO BE, Ben Ami Gallery, Tel Aviv, June 2023, curated by Doron Polak.",
        "Showcase Dreams, Ben Ami Gallery, Tel Aviv, November 2022, curated by Doron Polak.",
        "Near-Far, Marc Chagall Artists' House Gallery, Haifa, October 2022, curated by Menucha Cohn.",
        "A tribute to an artist, Marc Chagall Artists' House Gallery, Haifa, September 2022, curated by Menucha Cohn.",
    ]
    solo_exhibitions = [
        "The Inner Voyager, Global Art Gallery, Tel Aviv, Israel, October-November 2025.",
        "Alone with myself, Marc Chagall Artists' House Gallery, Haifa, August-September 2024, curated by Dina Bova. Re-exhibited at the Karmiel Performing Arts Center &amp; Gallery, February-March 2025.",
        "The HUMAN PERSISTENCE and TRANSFORMATION of Dov Fuchs (Virtual), Self Portraits on Fire website, December 16, 2024-January 16, 2025.",
        "Me, Myself &amp; I (Virtual), TeraVarna Gallery, Los Angeles, California, July 2023.",
        "Talk to the Wall, Givatayim Theater, May 2023, curated by Doron Polak.",
        "Summer, Winter, Ice, Fire, Abba Khushi House, Haifa, 2016, curated by Aviva Shemer.",
    ]
    interviews = [
        "Interviewed by Yvette Depaepe, Chief, Editorial Team, 1X Magazine: <i>Dov Fuchs: Personal yet universal 'Metaphorical Narratives'</i>, March 24, 2025.",
        "Interviewed by Anthony Rivera, Editorial Staff, Bold Journey Magazine: <i>Meet Dov Fuchs</i>, January 28, 2025.",
    ]
    awards = [
        "Over 190 photographs published in the 1X gallery, and over 50 have received Head Curator awards.",
        '"Up the Wall" received Special Mention in TeraVarna Gallery\'s SUMMER 2023 Artist Grant competition, July 2023.',
        '"Patriyoshka" received a Talent Award in TeraVarna Gallery\'s 8th Open International Juried Art competition, September 2023.',
        '"Up the Wall", "Time Flies By" and "Rebirth" received Honorable Mention Awards in TeraVarna Gallery\'s 8th Open International Juried Art competition, September 2023.',
        '"Fragments of Memories", "The Inner Child" and "Cosmic Embryo" received Finalist Awards in TeraVarna Gallery\'s 8th Open International Juried Art competition, September 2023.',
    ]

    def section(title, items):
        story.append(Paragraph(title, DOC_STYLES["h1"]))
        for item in items:
            story.append(Paragraph(f"&bull; {item}", DOC_STYLES["bullet"]))

    section("Solo Exhibitions", solo_exhibitions)
    section("Group Exhibitions", group_exhibitions)
    story.append(PageBreak())
    story.append(Paragraph("Residency", DOC_STYLES["h1"]))
    story.append(
        Paragraph(
            "In January 2027, Dov Fuchs is scheduled to participate in an international artist residency program at Chiasso Perduto, Florence, Italy, hosted in the historic palace of Niccolo Machiavelli's family.",
            DOC_STYLES["body"],
        )
    )
    story.append(Paragraph("Publications", DOC_STYLES["h1"]))
    story.append(
        Paragraph(
            "Dov Fuchs publishes regularly in <i>Living the Photo Artistic Life</i>, the online magazine of the international AWAKE artist group directed by Sebastian Michaels. Over 90 works have appeared in the magazine between 2019 and 2026. He was selected as Featured Artist in the February 2024 issue (Vol. 108). Hundreds of landscape images were sold through his Shutterstock contributor account.",
            DOC_STYLES["body"],
        )
    )
    section("International Magazine Interviews", interviews)
    section("Awards", awards)
    doc.build(story, onFirstPage=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | Artistic CV"), onLaterPages=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | Artistic CV"))


def build_about():
    doc = SimpleDocTemplate(
        str(DOC_DIR / "about.pdf"),
        pagesize=letter,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.82 * inch,
        bottomMargin=0.68 * inch,
    )
    story = [
        Paragraph("ABOUT", DOC_STYLES["kicker"]),
        Paragraph("Dov Fuchs", DOC_STYLES["title"]),
        Paragraph("A Journey from Aerospace to Inner Space", DOC_STYLES["h1"]),
        Paragraph(
            "Dov Fuchs is an Israeli digital artist whose surreal self-portraits blend photography and digital composition into metaphor-rich narratives exploring identity, memory, and the passage of time. His work is deeply introspective yet profoundly universal: an invitation to travel through the psychological landscapes we all share.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "Born in Haifa in 1948, Dov brings to his art the depth and precision of a life spent in pursuit of knowledge and innovation. For over 33 years, he held senior roles in research, development, and management at one of Israel's foremost aerospace and defense companies. A graduate of the Technion - Israel Institute of Technology, he holds both BSc and MSc degrees in Aerospace Engineering. In 2007, he took early retirement to pursue his long-held passion for the visual arts.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "Entirely self-taught, Dov approaches photography and digital art with both an engineer's analytical mind and an artist's boundless curiosity. He is the sole subject of nearly all his images, using his own body and face as a canvas through which to explore existential themes, philosophical paradoxes, and emotional undercurrents.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "Dov's work has been exhibited in solo and group exhibitions across Israel, the United States, and Europe, including the Marc Chagall Artists' House in Haifa, Ben Ami Gallery in Tel Aviv, Contemplor Gallery in Vienna, and TeraVarna Gallery in Los Angeles. His upcoming solo exhibition will open at the Global Art Gallery in Tel Aviv in October 2025.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "With over 190 published works on the prestigious 1X Gallery and more than 50 curator recognitions, Dov's images have also been featured in <i>Living the Photo Artistic Life</i>, where he was named Featured Artist in February 2024, as well as in interviews with 1X Magazine and Bold Journey Magazine.",
            DOC_STYLES["body"],
        ),
    ]
    doc.build(story, onFirstPage=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | About"), onLaterPages=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | About"))


def build_artist_statement():
    doc = SimpleDocTemplate(
        str(DOC_DIR / "artist-statement.pdf"),
        pagesize=letter,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.82 * inch,
        bottomMargin=0.68 * inch,
    )
    story = [
        Paragraph("ARTIST STATEMENT", DOC_STYLES["kicker"]),
        Paragraph("Dov Fuchs", DOC_STYLES["title"]),
        Paragraph("From Perception to Imagination", DOC_STYLES["h1"]),
        Paragraph(
            "I have held a camera in my hands for as long as I can remember. But in recent years, its purpose has shifted: from documenting the world to reimagining it. Today, the camera is no longer just a tool; it is my brush, my mirror, and my portal to the surreal.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "My process is entirely self-conducted. I am the sole participant in every stage of creation: the model, the photographer, and the digital composer. Using a tripod and a remote-control app, I photograph myself in planned poses and settings until I discover the perspective or gesture needed to bring the image to life.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "In many compositions, I appear multiple times, assuming different roles or personas within a single visual frame. Through this technique, I explore internal dialogue, identity fragmentation, and psychological layering.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "My images are built from photographic fragments I capture myself, often combined with artist-created or sourced visual elements, including at times AI-generated components. Each piece becomes a digitally constructed reality, layered with meaning and emotion.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "Like a patchwork quilt, every image harmonizes disparate fragments through extraction, distortion, and synthesis. The work invites viewers to question perception and engage with alternate visual logics, while touching on aging, isolation, transition, protest, social commentary, and the fear of losing one's way.",
            DOC_STYLES["body"],
        ),
        Paragraph(
            "Ultimately, I aim to create visual experiences that resonate emotionally, provoke reflection, and explore the delicate space where perception and imagination intertwine.",
            DOC_STYLES["body"],
        ),
    ]
    doc.build(story, onFirstPage=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | Artist Statement"), onLaterPages=lambda c, d: draw_doc_page(c, d, "Dov Fuchs | Artist Statement"))


def draw_contact_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.4)
    canvas.rect(0.52 * inch, 0.52 * inch, PAGE_W - 1.04 * inch, PAGE_H - 1.04 * inch, stroke=1, fill=0)
    canvas.setStrokeColor(MOSS)
    canvas.setLineWidth(0.8)
    canvas.rect(0.62 * inch, 0.62 * inch, PAGE_W - 1.24 * inch, PAGE_H - 1.24 * inch, stroke=1, fill=0)
    canvas.setFillColor(colors.Color(0.78, 0.61, 0.29, alpha=0.09))
    canvas.circle(PAGE_W - 1.4 * inch, PAGE_H - 1.7 * inch, 1.2 * inch, stroke=0, fill=1)
    canvas.circle(1.15 * inch, 1.28 * inch, 0.72 * inch, stroke=0, fill=1)
    canvas.restoreState()


def build_contact():
    out = DOC_DIR / "contact-info.pdf"
    doc = SimpleDocTemplate(
        str(out),
        pagesize=letter,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.9 * inch,
    )

    contact_styles = {
        "kicker": ParagraphStyle(
            "contact_kicker",
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            textColor=MOSS,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "title": ParagraphStyle(
            "contact_title",
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=33,
            textColor=CREAM,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "script": ParagraphStyle(
            "contact_script",
            fontName="Times-Italic",
            fontSize=31,
            leading=34,
            textColor=PALE_GOLD,
            alignment=TA_CENTER,
            spaceAfter=24,
        ),
        "label": ParagraphStyle(
            "contact_label",
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=MOSS,
            spaceAfter=2,
        ),
        "value": ParagraphStyle(
            "contact_value",
            fontName="Helvetica-Bold",
            fontSize=12.2,
            leading=15,
            textColor=CREAM,
            spaceAfter=0,
        ),
        "note": ParagraphStyle(
            "contact_note",
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=PALE_GOLD,
            alignment=TA_CENTER,
            spaceBefore=18,
        ),
    }

    rows = []
    items = [
        ("EMAIL", "fuchsd@netvision.net.il"),
        ("WEBSITE", "https://dovfuchs.art/"),
        ("INSTAGRAM", "@dovfuchs"),
        ("1X GALLERY", "https://1x.com/DovFuchs"),
    ]
    for label, value in items:
        rows.append(
            [
                Paragraph(label, contact_styles["label"]),
                Paragraph(value, contact_styles["value"]),
            ]
        )

    table = Table(rows, colWidths=[1.55 * inch, 4.45 * inch], rowHeights=None, hAlign="CENTER")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#15130f")),
                ("BOX", (0, 0), (-1, -1), 0.8, GOLD),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#4b422e")),
                ("LEFTPADDING", (0, 0), (-1, -1), 16),
                ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    story = [
        Spacer(1, 0.3 * inch),
        Paragraph("CONTACT INFORMATION", contact_styles["kicker"]),
        Paragraph("Dov Fuchs", contact_styles["script"]),
        Paragraph("Digital Art Gallery", contact_styles["title"]),
        Spacer(1, 0.16 * inch),
        table,
        Paragraph("For exhibition inquiries, acquisitions, curatorial correspondence, and professional contact.", contact_styles["note"]),
    ]
    doc.build(story, onFirstPage=draw_contact_background, onLaterPages=draw_contact_background)


def add_pdf_links(pdf_name):
    if fitz is None:
        return
    pdf_path = DOC_DIR / pdf_name
    if not pdf_path.exists():
        return
    link_targets = {
        "fuchsd@netvision.net.il": "mailto:fuchsd@netvision.net.il",
        "https://dovfuchs.art/": "https://dovfuchs.art/",
        "https://1x.com/DovFuchs": "https://1x.com/DovFuchs",
        "1x.com/DovFuchs": "https://1x.com/DovFuchs",
        "dovfuchs.art": "https://dovfuchs.art/",
        "@dovfuchs": "https://www.instagram.com/dovfuchs/",
    }
    doc = fitz.open(pdf_path)
    for page in doc:
        existing = list(page.links())
        for label, uri in link_targets.items():
            for rect in page.search_for(label):
                if any(rect.intersects(link.get("from")) for link in existing if link.get("from")):
                    continue
                page.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": uri})
        text = page.get_text()
        for url in set(re.findall(r"https://[^\s|)]+", text)):
            for rect in page.search_for(url):
                page.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": url.rstrip(".")})
    tmp_path = pdf_path.with_suffix(".linked.pdf")
    doc.save(tmp_path)
    doc.close()
    tmp_path.replace(pdf_path)


if __name__ == "__main__":
    build_about()
    build_artist_statement()
    build_contact()
    build_cv()
    for pdf in ["about.pdf", "artist-statement.pdf", "contact-info.pdf", "cv.pdf", "price-list.pdf"]:
        add_pdf_links(pdf)
