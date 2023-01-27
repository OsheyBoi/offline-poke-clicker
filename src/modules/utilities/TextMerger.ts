import type { Observable } from 'knockout';

export default class TextMerger {
    private static mergeValues : { [name: string]: Observable<string> };

    public static mergeText(text: string) : string {
        if (this.mergeValues == null) {
            this.BuildMergeValues();
        }
        const mergeSubstrings = text.match(/\$[a-zA-Z]*\$/g);
        if (mergeSubstrings == null) {
            return text;
        }

        let textResult = text;
        mergeSubstrings.forEach((s) => {
            const key = s.substring(1, s.length - 1).toLocaleLowerCase();
            if (this.mergeValues[key]()) {
                textResult = text.replace(s, this.mergeValues[key]());
            }
        });

        return textResult;
    }

    private static BuildMergeValues() {
        this.mergeValues = {
            playername: App.game.profile.name,
        };
    }
}
