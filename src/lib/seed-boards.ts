import { Board, Card, Column } from "@/types/board";
import { generateId } from "@/lib/ids";
import { nowISO, todayKey } from "@/lib/dates";
import { addDays } from "date-fns";
import { formatDateKey } from "@/lib/dates";

function makeCol(boardId: string, title: string, position: number, color: string): Column {
  return { id: generateId(), boardId, title, position, color };
}

function makeCard(
  boardId: string,
  columnId: string,
  position: number,
  title: string,
  opts?: { description?: string; dueDate?: string; priority?: Card["priority"]; labels?: Card["labels"]; subtasks?: Card["subtasks"] }
): Card {
  const now = nowISO();
  return {
    id: generateId(),
    boardId,
    columnId,
    title,
    description: opts?.description || "",
    labels: opts?.labels || [],
    dueDate: opts?.dueDate || null,
    position,
    linkedDailyDate: null,
    subtasks: opts?.subtasks || [],
    recurrence: null,
    priority: opts?.priority || null,
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createSeedBoards(): Board[] {
  const now = nowISO();
  const today = todayKey();
  const tomorrow = formatDateKey(addDays(new Date(), 1));
  const day3 = formatDateKey(addDays(new Date(), 2));
  const day4 = formatDateKey(addDays(new Date(), 3));
  const day5 = formatDateKey(addDays(new Date(), 4));

  // --- Exercise Board ---
  const exId = generateId();
  const exTodo = makeCol(exId, "To Do", 0, "#3b82f6");
  const exInProg = makeCol(exId, "In Progress", 1, "#6B9BD2");
  const exDone = makeCol(exId, "Done", 2, "#22c55e");

  const exLabelStrength = { id: generateId(), name: "Strength", color: "#ef4444" };
  const exLabelCardio = { id: generateId(), name: "Cardio", color: "#f59e0b" };
  const exLabelFlexibility = { id: generateId(), name: "Flexibility", color: "#a855f7" };
  const exLabelRest = { id: generateId(), name: "Rest", color: "#22c55e" };

  const exerciseBoard: Board = {
    id: exId,
    title: "Exercise Plan",
    description: "Weekly workout schedule & fitness goals",
    color: "#ef4444",
    columns: [exTodo, exInProg, exDone],
    cards: [
      // To Do
      makeCard(exId, exTodo.id, 0, "Morning run — 5K", {
        description: "Easy pace, focus on breathing. Route: park loop x2.",
        dueDate: today,
        priority: "high",
        labels: [exLabelCardio],
        subtasks: [
          { id: generateId(), text: "Warm-up stretches (5 min)", done: false },
          { id: generateId(), text: "Run 5K", done: false },
          { id: generateId(), text: "Cool-down walk (5 min)", done: false },
        ],
      }),
      makeCard(exId, exTodo.id, 1, "Upper body — Push day", {
        description: "Bench press, overhead press, tricep dips, push-ups.",
        dueDate: tomorrow,
        priority: "high",
        labels: [exLabelStrength],
        subtasks: [
          { id: generateId(), text: "Bench press 4×8", done: false },
          { id: generateId(), text: "Overhead press 3×10", done: false },
          { id: generateId(), text: "Tricep dips 3×12", done: false },
          { id: generateId(), text: "Push-ups to failure", done: false },
        ],
      }),
      makeCard(exId, exTodo.id, 2, "Yoga session — 30 min", {
        description: "Follow along video. Focus on hip openers and hamstrings.",
        dueDate: day3,
        priority: "medium",
        labels: [exLabelFlexibility],
      }),
      makeCard(exId, exTodo.id, 3, "Lower body — Leg day", {
        description: "Squats, lunges, leg press, calf raises.",
        dueDate: day4,
        priority: "high",
        labels: [exLabelStrength],
        subtasks: [
          { id: generateId(), text: "Squats 4×8", done: false },
          { id: generateId(), text: "Walking lunges 3×12 each", done: false },
          { id: generateId(), text: "Leg press 3×10", done: false },
          { id: generateId(), text: "Calf raises 3×15", done: false },
        ],
      }),
      makeCard(exId, exTodo.id, 4, "HIIT cardio — 20 min", {
        description: "30s on / 30s off. Burpees, mountain climbers, jump squats, high knees.",
        dueDate: day5,
        priority: "medium",
        labels: [exLabelCardio],
      }),
      makeCard(exId, exTodo.id, 5, "Rest & recovery day", {
        description: "Light walk, foam rolling, hydrate well.",
        labels: [exLabelRest],
        priority: "low",
      }),
      // In Progress
      makeCard(exId, exInProg.id, 0, "Track weekly step count", {
        description: "Goal: 70,000 steps/week (10K/day average).",
        priority: "medium",
        labels: [exLabelCardio],
        subtasks: [
          { id: generateId(), text: "Monday — 10K steps", done: true },
          { id: generateId(), text: "Tuesday — 10K steps", done: true },
          { id: generateId(), text: "Wednesday — 10K steps", done: false },
          { id: generateId(), text: "Thursday — 10K steps", done: false },
          { id: generateId(), text: "Friday — 10K steps", done: false },
          { id: generateId(), text: "Weekend — 20K steps", done: false },
        ],
      }),
      // Done
      makeCard(exId, exDone.id, 0, "Set up workout playlist", {
        description: "High-energy tracks for gym sessions.",
        labels: [exLabelCardio],
      }),
    ],
    createdAt: now,
    updatedAt: now,
  };

  // --- Meal Plan Board ---
  const mlId = generateId();
  const mlPlan = makeCol(mlId, "To Plan", 0, "#3b82f6");
  const mlPrepped = makeCol(mlId, "Prepped", 1, "#f59e0b");
  const mlDone = makeCol(mlId, "Eaten", 2, "#22c55e");

  const mlLabelBreakfast = { id: generateId(), name: "Breakfast", color: "#f97316" };
  const mlLabelLunch = { id: generateId(), name: "Lunch", color: "#22c55e" };
  const mlLabelDinner = { id: generateId(), name: "Dinner", color: "#3b82f6" };
  const mlLabelSnack = { id: generateId(), name: "Snack", color: "#a855f7" };
  const mlLabelMealPrep = { id: generateId(), name: "Meal Prep", color: "#14b8a6" };

  const mealBoard: Board = {
    id: mlId,
    title: "Meal Plan",
    description: "Weekly meals, prep tasks & grocery lists",
    color: "#22c55e",
    columns: [mlPlan, mlPrepped, mlDone],
    cards: [
      // To Plan
      makeCard(mlId, mlPlan.id, 0, "Overnight oats with berries", {
        description: "Oats, Greek yogurt, chia seeds, mixed berries, honey.\nPrep night before — 5 min.",
        dueDate: today,
        priority: "medium",
        labels: [mlLabelBreakfast],
        subtasks: [
          { id: generateId(), text: "Mix oats + yogurt + chia in jar", done: false },
          { id: generateId(), text: "Top with berries in morning", done: false },
        ],
      }),
      makeCard(mlId, mlPlan.id, 1, "Grilled chicken salad", {
        description: "Grilled chicken breast, mixed greens, cherry tomatoes, cucumber, feta, olive oil dressing.",
        dueDate: today,
        priority: "high",
        labels: [mlLabelLunch],
      }),
      makeCard(mlId, mlPlan.id, 2, "Salmon with roasted vegetables", {
        description: "Baked salmon fillet, roasted broccoli & sweet potato.\n~450 cal, high protein.",
        dueDate: today,
        priority: "high",
        labels: [mlLabelDinner],
        subtasks: [
          { id: generateId(), text: "Season salmon", done: false },
          { id: generateId(), text: "Chop & roast vegetables (400°F, 25 min)", done: false },
          { id: generateId(), text: "Bake salmon (400°F, 15 min)", done: false },
        ],
      }),
      makeCard(mlId, mlPlan.id, 3, "Smoothie bowl — banana & spinach", {
        description: "Banana, spinach, protein powder, almond milk, granola topping.",
        dueDate: tomorrow,
        labels: [mlLabelBreakfast],
        priority: "low",
      }),
      makeCard(mlId, mlPlan.id, 4, "Turkey & avocado wrap", {
        description: "Whole wheat wrap, sliced turkey, avocado, lettuce, tomato, mustard.",
        dueDate: tomorrow,
        labels: [mlLabelLunch],
        priority: "medium",
      }),
      makeCard(mlId, mlPlan.id, 5, "Stir-fry tofu with rice", {
        description: "Crispy tofu, bell peppers, snap peas, soy sauce glaze, jasmine rice.",
        dueDate: tomorrow,
        labels: [mlLabelDinner],
        priority: "medium",
      }),
      makeCard(mlId, mlPlan.id, 6, "Greek yogurt & almonds", {
        description: "High protein snack. ~200 cal.",
        labels: [mlLabelSnack],
        priority: "low",
      }),
      makeCard(mlId, mlPlan.id, 7, "Protein energy balls", {
        description: "Oats, peanut butter, honey, chocolate chips, protein powder. Make 12.",
        labels: [mlLabelSnack, mlLabelMealPrep],
        priority: "medium",
        subtasks: [
          { id: generateId(), text: "Mix all ingredients", done: false },
          { id: generateId(), text: "Roll into 12 balls", done: false },
          { id: generateId(), text: "Refrigerate 30 min", done: false },
        ],
      }),
      // Prepped
      makeCard(mlId, mlPrepped.id, 0, "Sunday meal prep — chicken & rice", {
        description: "Batch cook: 6 chicken breasts, 4 cups rice, roasted veggies.\nPortioned into 5 containers for weekday lunches.",
        labels: [mlLabelMealPrep, mlLabelLunch],
        priority: "high",
        subtasks: [
          { id: generateId(), text: "Cook rice in bulk", done: true },
          { id: generateId(), text: "Grill chicken breasts", done: true },
          { id: generateId(), text: "Roast mixed vegetables", done: true },
          { id: generateId(), text: "Portion into containers", done: false },
        ],
      }),
      makeCard(mlId, mlPrepped.id, 1, "Grocery run — weekly essentials", {
        description: "Check fridge & pantry first.",
        labels: [mlLabelMealPrep],
        priority: "high",
        subtasks: [
          { id: generateId(), text: "Fruits: berries, bananas, apples", done: true },
          { id: generateId(), text: "Protein: chicken, salmon, tofu, eggs", done: true },
          { id: generateId(), text: "Vegetables: broccoli, spinach, peppers", done: false },
          { id: generateId(), text: "Pantry: oats, rice, wraps", done: false },
          { id: generateId(), text: "Dairy: Greek yogurt, feta, almond milk", done: false },
        ],
      }),
      // Done
      makeCard(mlId, mlDone.id, 0, "Plan this week's menu", {
        description: "All 7 days planned with balanced macros.",
      }),
    ],
    createdAt: now,
    updatedAt: now,
  };

  return [exerciseBoard, mealBoard];
}
