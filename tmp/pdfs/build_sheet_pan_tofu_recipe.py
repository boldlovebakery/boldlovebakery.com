from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    FrameBreak,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)


OUTPUT = "/Users/george/work/boldlovebakery.com/output/pdf/sheet-pan-tofu-with-corn-and-chiles.pdf"

INK = colors.HexColor("#26231F")
MUTED = colors.HexColor("#6C6258")
ACCENT = colors.HexColor("#A63D2F")
PALE = colors.HexColor("#F5EFE7")
RULE = colors.HexColor("#D9CEC1")


def page_decor(canvas, doc):
    width, height = letter
    canvas.saveState()
    canvas.setFillColor(PALE)
    canvas.rect(0, height - 1.53 * inch, width, 1.53 * inch, fill=1, stroke=0)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, height - 0.10 * inch, width, 0.10 * inch, fill=1, stroke=0)
    title_left = "SHEET-PAN TOFU "
    title_right = "WITH CORN & CHILES"
    canvas.setFont("Helvetica", 22)
    title_width = canvas.stringWidth(title_left, "Helvetica", 22) + canvas.stringWidth(
        title_right, "Helvetica", 22
    )
    title_x = (width - title_width) / 2
    canvas.setFillColor(INK)
    canvas.drawString(title_x, height - 0.79 * inch, title_left)
    canvas.setFillColor(ACCENT)
    canvas.drawString(
        title_x + canvas.stringWidth(title_left, "Helvetica", 22),
        height - 0.79 * inch,
        title_right,
    )
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8.4)
    meta = "2-4 servings  •  425°F  •  about 45-65 minutes, including draining"
    canvas.drawCentredString(width / 2, height - 1.13 * inch, meta)
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.6)
    canvas.line(0.48 * inch, 0.43 * inch, width - 0.48 * inch, 0.43 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 6.8)
    canvas.drawString(0.48 * inch, 0.24 * inch, "Recipe by Melissa Clark • NYT Cooking")
    canvas.drawRightString(width - 0.48 * inch, 0.24 * inch, "Print-friendly kitchen copy")
    canvas.restoreState()


doc = BaseDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.48 * inch,
    rightMargin=0.48 * inch,
    topMargin=0.38 * inch,
    bottomMargin=0.52 * inch,
    title="Sheet-Pan Tofu With Corn and Chiles",
    author="Melissa Clark, NYT Cooking",
)

left_frame = Frame(
    doc.leftMargin,
    doc.bottomMargin,
    2.43 * inch,
    letter[1] - 2.03 * inch,
    leftPadding=0,
    rightPadding=0.17 * inch,
    topPadding=0,
    bottomPadding=0,
    id="ingredients",
)
right_frame = Frame(
    doc.leftMargin + 2.58 * inch,
    doc.bottomMargin,
    doc.width - 2.58 * inch,
    letter[1] - 2.03 * inch,
    leftPadding=0.16 * inch,
    rightPadding=0,
    topPadding=0,
    bottomPadding=0,
    id="method",
    showBoundary=0,
)
doc.addPageTemplates(
    [PageTemplate(id="recipe", frames=[left_frame, right_frame], onPage=page_decor)]
)

title_style = ParagraphStyle(
    "Title",
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=23,
    textColor=INK,
    alignment=TA_CENTER,
    spaceAfter=6,
)
dek_style = ParagraphStyle(
    "Dek",
    fontName="Helvetica",
    fontSize=8.4,
    leading=10.2,
    textColor=MUTED,
    alignment=TA_CENTER,
)
section_style = ParagraphStyle(
    "Section",
    fontName="Helvetica-Bold",
    fontSize=11.2,
    leading=13,
    textColor=ACCENT,
    spaceAfter=7,
    uppercase=True,
)
ingredient_style = ParagraphStyle(
    "Ingredient",
    fontName="Helvetica",
    fontSize=9.2,
    leading=11.7,
    textColor=INK,
    leftIndent=10,
    firstLineIndent=-10,
    bulletIndent=0,
    spaceAfter=4.0,
)
step_style = ParagraphStyle(
    "Step",
    fontName="Helvetica",
    fontSize=9.0,
    leading=11.2,
    textColor=INK,
    leftIndent=18,
    firstLineIndent=-18,
    spaceAfter=5.7,
)
note_style = ParagraphStyle(
    "Note",
    fontName="Helvetica-Oblique",
    fontSize=8.3,
    leading=10.4,
    textColor=MUTED,
    borderColor=RULE,
    borderWidth=0.6,
    borderPadding=6,
    backColor=colors.HexColor("#FBF8F3"),
    spaceBefore=4,
)

ingredients = [
    "1 (14- to 16-ounce) package extra-firm tofu, cut crosswise into 1-inch-thick slices",
    "1 tablespoon cornstarch",
    "1¾ teaspoons fine sea or table salt, plus more as needed",
    "1 teaspoon chili powder, plus more as needed",
    "½ teaspoon ground cumin, plus more as needed",
    "3 cups fresh or frozen corn kernels (from about 3 large ears)",
    "2 jalapeños, halved, seeded if desired and thinly sliced",
    "1 red onion, halved and thinly sliced into half-moons",
    "1 poblano chile, halved, seeded and thinly sliced (1 cup)",
    "3 tablespoons extra-virgin olive oil, plus more for drizzling",
    "1 lime, halved",
    "1 garlic clove, finely grated or minced",
    "½ cup chopped fresh cilantro or basil",
]

steps = [
    "Heat oven to <b>425°F</b>. Line a baking sheet with parchment paper.",
    "Arrange tofu slices on a clean kitchen towel or paper towels. Cover with another towel, then place a flat cutting board or baking pan on top. Weight it with a few cans or a skillet if needed. Drain for at least 15 minutes and up to 45 minutes.",
    "While the tofu drains, stir together the cornstarch, ½ teaspoon salt, chili powder and cumin in a medium bowl.",
    "In another bowl, combine the corn, about half the jalapeño slices (reserve the rest), red onion, poblano, 2 tablespoons olive oil and the remaining 1¼ teaspoons salt. Mix well.",
    "Transfer the drained tofu to a cutting board and cut into 1-inch cubes; pat dry. Add to the cornstarch mixture and toss well. Drizzle with 1 tablespoon olive oil and toss gently to coat.",
    "Spread tofu on the baking sheet with space between the cubes. Roast 15 minutes. Flip the tofu and nudge it to one side; spoon the corn mixture onto the empty half. Drizzle everything with a little more oil. Roast until the tofu is golden and crisp, 15 to 20 minutes more, stirring the corn once.",
    "Meanwhile, squeeze the lime juice into a small bowl. Add a pinch each of chili powder, cumin and salt; stir in the reserved jalapeño and the garlic.",
    "Just before serving, pour the lime-chile mixture over the corn and toss well. Top everything with cilantro or basil and serve.",
]

story = [
    Paragraph("INGREDIENTS", section_style),
]
for ingredient in ingredients:
    story.append(Paragraph("• " + ingredient, ingredient_style))

story.extend(
    [
        Spacer(1, 4),
        Paragraph("KITCHEN NOTE", section_style),
        Paragraph(
            "Frozen corn works well year-round. If it releases extra moisture, allow a few additional minutes of roasting so the tofu stays crisp.",
            note_style,
        ),
        FrameBreak(),
        Paragraph("METHOD", section_style),
    ]
)
for number, step in enumerate(steps, 1):
    story.append(KeepTogether([Paragraph(f"<b>{number}</b>&nbsp;&nbsp;{step}", step_style)]))

doc.build(story)
print(OUTPUT)
