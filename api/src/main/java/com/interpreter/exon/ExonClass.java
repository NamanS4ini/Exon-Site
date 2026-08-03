package com.interpreter.exon;

import java.util.List;
import java.util.Map;

public class ExonClass implements ExonCallable {
    final String name;
    final ExonClass superclass;
    private final Map<String, ExonFunction> methods;
    
    ExonClass(String name, ExonClass superclass, Map<String, ExonFunction> methods) {
        this.superclass = superclass;
        this.name = name;
        this.methods = methods;
    }
    
    ExonFunction findMethod(String name) {
        if (methods.containsKey(name)) {
            return methods.get(name);
        }

        if (superclass != null) {
            return superclass.findMethod(name);
        }
        return null;
    }

    @Override
    public String toString() {
        return name;
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        ExonInstance instance = new ExonInstance(this);
        ExonFunction initializer = findMethod("init");
        if (initializer != null) {
            initializer.bind(instance).call(interpreter, arguments);
        }
        return instance;
    }

    @Override
    public int arity() {
        ExonFunction initializer = findMethod("init");
        if (initializer == null)
            return 0;
        return initializer.arity();
    }
}
