        const { year, term, department, courseNumber } = extractCourseDetails(message);

        // If department and courseNumber are found, use defaults for missing year/term
        if (department && courseNumber) {
            const defaultYear = year || "2024";
            const defaultTerm = term || "fall";
            
            console.log(`📚 Course query detected: ${department} ${courseNumber} (using ${defaultTerm} ${defaultYear})`);
            
            // Store course context with defaults
            courseContext = { year: defaultYear, term: defaultTerm, department, courseNumber };

            const { sections, error } = await fetchAvailableSections(defaultYear, defaultTerm, department, courseNumber);
            if (error || !sections.length) {
                return res.status(404).json({ response: "No sections available for this course." });
            }

            const sectionList = sections.map(sec => `${sec.text} - ${sec.title}`).join("\n");
            return res.json({
                response: `Here are the available sections for ${department} ${courseNumber} (${defaultTerm} ${defaultYear}):\n${sectionList}\n\nPlease type the section code (e.g., D100) to get the course outline.`
            });
        }
