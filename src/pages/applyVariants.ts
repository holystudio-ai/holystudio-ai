export type ApplyFieldName =
    | 'name'
    | 'phone'
    | 'telegram'
    | 'source'
    | 'role'
    | 'income'
    | 'interest'
    | 'motivation'
    | 'readiness';

export interface ApplyVariant {
    /** Route path without the leading slash — this is the link media buyers get. */
    slug: string;
    /** Which fields this variant renders. Order in the form is fixed, not taken
     *  from here, so listing a field is enough to switch it on. */
    fields: ApplyFieldName[];
}

/**
 * Both pre-registration links are the same form with different field sets:
 * /apply2 is the short version used to test whether fewer questions convert
 * better. Leads land in the same sheet — the `Source page` column shows which
 * form they came from.
 */
export const APPLY_VARIANTS: ApplyVariant[] = [
    {
        slug: 'apply',
        fields: ['name', 'phone', 'telegram', 'source', 'role', 'interest', 'motivation', 'readiness'],
    },
    {
        slug: 'apply2',
        fields: ['name', 'phone', 'telegram', 'interest', 'readiness'],
    },
];
