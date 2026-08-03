package com.interpreter.exon;

import java.util.List;

public interface ExonCallable {
    int arity();
    Object call(Interpreter interpreter, List<Object> arguments);
}
