package com.exon.api.service;

import com.exon.api.model.ExampleProgram;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Provides the static registry of built-in Exon example programs.
 *
 * <p>These examples are served from GET /api/examples and used by both the
 * playground dropdown and documentation's "Open in Playground" links.</p>
 */
@Service
public class ExamplesService {

    private static final List<ExampleProgram> EXAMPLES = List.of(
        new ExampleProgram(
            "hello-world",
            "Hello World",
            "The classic first program.",
            """
            out "Hello, World!";
            """
        ),
        new ExampleProgram(
            "variables",
            "Variables",
            "Declare and use variables with set.",
            """
            set x = 42;
            set name = "Exon";
            out x;
            out name;
            out x + 8;
            """
        ),
        new ExampleProgram(
            "fibonacci",
            "Fibonacci",
            "Recursive Fibonacci using fxn.",
            """
            fxn fib(n) {
              if (n <= 1) return n;
              return fib(n - 1) + fib(n - 2);
            }
            for (set i = 0; i < 10; i = i + 1) {
              out fib(i);
            }
            """
        ),
        new ExampleProgram(
            "fizzbuzz",
            "FizzBuzz",
            "The classic FizzBuzz problem.",
            """
            for (set i = 1; i <= 20; i = i + 1) {
              if (i % 3 == 0 and i % 5 == 0) {
                out "FizzBuzz";
              } else if (i % 3 == 0) {
                out "Fizz";
              } else if (i % 5 == 0) {
                out "Buzz";
              } else {
                out i;
              }
            }
            """
        ),
        new ExampleProgram(
            "closures",
            "Closures",
            "Counter factory using closures and first-class functions.",
            """
            fxn makeCounter() {
              set count = 0;
              fxn increment() {
                count = count + 1;
                return count;
              }
              return increment;
            }
            set c = makeCounter();
            out c();
            out c();
            out c();
            """
        ),
        new ExampleProgram(
            "classes",
            "Classes",
            "Object-oriented programming with classes and methods.",
            """
            class Point {
              init(x, y) {
                this.x = x;
                this.y = y;
              }
              toString() {
                return "(" + str(this.x) + ", " + str(this.y) + ")";
              }
            }
            set p = Point(3, 4);
            out p.toString();
            """
        ),
        new ExampleProgram(
            "inheritance",
            "Inheritance",
            "Class inheritance with super method dispatch.",
            """
            class Animal {
              init(name) {
                this.name = name;
              }
              speak() {
                return this.name + " makes a sound.";
              }
            }
            class Dog < Animal {
              speak() {
                return this.name + " barks!";
              }
            }
            set d = Dog("Rex");
            out d.speak();
            """
        ),
        new ExampleProgram(
            "recursion",
            "Recursion",
            "Factorial computed recursively.",
            """
            fxn factorial(n) {
              if (n <= 1) return 1;
              return n * factorial(n - 1);
            }
            out factorial(10);
            """
        )
    );

    /** Cache for O(1) id-based lookup. */
    private final Map<String, ExampleProgram> byId = EXAMPLES.stream()
            .collect(Collectors.toMap(ExampleProgram::id, Function.identity()));

    /** Returns all example programs. */
    public List<ExampleProgram> findAll() {
        return EXAMPLES;
    }

    /** Returns the example with the given id, or empty if not found. */
    public Optional<ExampleProgram> findById(String id) {
        return Optional.ofNullable(byId.get(id));
    }
}
